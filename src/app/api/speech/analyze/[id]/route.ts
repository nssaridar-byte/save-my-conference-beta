import { TSpeechAnalyze } from "@/app/types";
import { ai } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { subscriptionValid } from "@/lib/subscription";
import { withAuth } from "@/lib/auth";
import { Subscription } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/client";
import { differenceInHours } from "date-fns";

export const POST = withAuth(async (req, user, { params }) => {
  try {
    const fullUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        subscription: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!fullUser) return new Response("Unauthorized", { status: 401 });
    const { id } = await params;

    let usage = await prisma.usage.findUnique({
      where: {
        userId: fullUser.id,
      },
    });

    // Check if usage exists and if the user is on the free tier (no subscription or invalid subscription)
    const isPro =
      fullUser.subscription &&
      (await subscriptionValid(fullUser.subscription as unknown as Subscription));

    if (usage && !isPro) {
      if (usage.speechesCount + 1 == 3) {
        await prisma.usage.update({
          where: {
            userId: fullUser.id,
          },
          data: {
            speechesLimitHitAt: new Date(),
          },
        });
      }
      if (usage.speechesLimitHitAt) {
        const hoursSinceLastHit = differenceInHours(
          new Date(),
          usage.speechesLimitHitAt,
        );

        if (hoursSinceLastHit >= 24) {
          usage = await prisma.usage.update({
            where: { userId: fullUser.id },
            data: { speechesCount: 0, speechesLimitHitAt: null },
          });
        } else {
          return new Response("Limit reached", { status: 403 });
        }
      }
    }

    const speech = await prisma.speech.findUnique({
      where: {
        id,
      },
    });
    if (!speech) return new Response("Speech not found", { status: 404 });

    if (speech.userId !== fullUser.id)
      return new Response("Unauthorized", { status: 401 });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `You are an expert Model United Nations (MUN) Chairperson and experienced debate adjudicator. Your task is to evaluate a delegate's speech transcript objectively and consistently.
      
EVALUATION RUBRIC:
1. Hook & Structure: Strength of the opening and adherence to H-P-A (Hook, Point, Action) format.
2. Policy Alignment: Realistic diplomatic stance and use of formal MUN terminology.
3. Substance & Solutions: Presence of actionable, realistic solutions rather than just problem-stating.
4. Persuasiveness & Rhetoric: Appropriateness of tone and the strength of the final call to action.

SCORING SYSTEM:
For each rubric category, assign a letter grade: A, B, C, D, or F.

CRITICAL OUTPUT RULES:
1. Return ONLY a valid JSON object. No markdown, no backticks, no conversational filler.
2. Provide EXACTLY three (3) strengths.
3. Provide EXACTLY three (3) weaknesses.
4. Provide two (2) to three (3) actionable improvement tips.
5. Keep every feedback point to one concise sentence.

JSON STRUCTURE:
{
    "scores": {
        "structure": "Grade",
        "policy": "Grade",
        "substance": "Grade",
        "rhetoric": "Grade"
        },
  "overall_grade": "Grade",
  "feedback": {
    "strengths": [
        "First concise strength.",
      "Second concise strength.",
      "Third concise strength."
    ],
    "weaknesses": [
        "First concise weakness.",
      "Second concise weakness.",
      "Third concise weakness."
      ],
      "improvement_tips": [
      "First specific tip.",
      "Second specific tip."
    ]
    }
}
  
"""${speech.content}"""`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const analysis = JSON.parse(response.text as string) as TSpeechAnalyze;

    const feedbackData: JsonObject = {
      strengths: analysis.feedback.strengths,
      weaknesses: analysis.feedback.weaknesses,
      tips: analysis.feedback.improvement_tips,
    };
    await prisma.$transaction([
      prisma.usage.upsert({
        where: { userId: fullUser.id },
        update: { speechesCount: { increment: 1 } },
        create: { userId: fullUser.id, speechesCount: 1 },
      }),
      prisma.speech.update({
        where: {
          id: speech.id,
        },
        data: {
          grade: analysis.overall_grade,
          feedback: feedbackData,
        },
      }),
    ]);
    return Response.json(analysis);
  } catch (error: any) {
    return new Response(error.message || "Internal Server Error", {
      status: 500,
    });
  }
});
