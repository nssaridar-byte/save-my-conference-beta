import { AuthUser, withAuth } from "@/lib/auth";
import { ai } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { recordTokenUsage } from "@/lib/token-usage";
import { subscriptionValid } from "@/lib/subscription";
import { Subscription } from "@prisma/client";

export const POST = withAuth(
  async (
    req: Request,
    user: AuthUser,
    context: { params: Promise<{ id: string }> },
  ) => {
    try {
      const { id } = await context.params;
      const usage = await prisma.usage.findUnique({
        where: {
          userId: user.id,
        },
      });

      const userObj = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          conferences: true,
          files: true,
          speeches: true,
          subscription: true,
        },
      });
      if (!userObj) return new Response("Unauthorized", { status: 401 });

      // The user has a pro subscription if the user subscription is valid
      const isPro =
        userObj.subscription &&
        (await subscriptionValid(
          userObj.subscription as unknown as Subscription,
        ));
      // Check if the user doesn't have (the pro subscription or if he is on the free tier ) and that he has accumalated some usage

      if ((!isPro || userObj.role == "FREE") && usage) {
        // If the usage count including the one he is making is equal to the limit, update the limit hit at but still allow it to pass through
        if (usage.quizzesCount + 1 == 100) {
          await prisma.usage.update({
            where: {
              userId: user.id,
            },
            data: {
              quizzesLimitHitAt: new Date(),
            },
          });
        }
        // If the speechesCount is more than or equal to 3, throw an error
        if (usage.quizzesCount >= 100)
          return new Response("Usage limit reached", { status: 403 });
      }
      const conference = await prisma.conference.findUnique({
        where: {
          id,
        },
      });

      if (!conference) return new Response("Conference not found");
      const previousQuizzes = await prisma.quiz.findMany({
        where: {
          conferenceId: id,
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        select: {
          questions: true,
        },
      });

      const existingQuestions = previousQuizzes
        .flatMap((q: any) => (Array.isArray(q.questions) ? q.questions : []))
        .map((q: any) => q.question)
        .filter(Boolean);

      const exclusionList =
        existingQuestions.length > 0
          ? `\nMAKE SURE TO NOT INCLUDE ANY OF THE FOLLOWING QUESTIONS OR QUESTIONS SIMILAR TO THEM:\n${existingQuestions.map((q: string) => `- ${q}`).join("\n")}`
          : "";

      const prompt = `You are an expert Model United Nations (MUN) Director and Educational Content Creator. Your task is to generate challenging, educational multiple-choice quiz questions based on the provided conference topic.

CONFERENCE TOPIC:
"${conference.topic}"

REQUIREMENTS:
1. Generate exactly 5 multiple-choice questions.
2. Cover a mix of historical context, key stakeholders, current challenges, and relevant MUN parliamentary procedure related to the topic.
3. Provide exactly 4 options for each question.
4. The "correct" field must be the 0-based index of the correct answer in the "options" array (0, 1, 2, or 3).
5. Provide a clear, educational explanation for why the answer is correct.
${exclusionList}

OUTPUT FORMAT:
Return ONLY a valid JSON array of objects. Do not include markdown formatting, backticks, or conversational text.

JSON SCHEMA TO FOLLOW EXACTLY:
[
  {
    "id": 1,
    "category": "String (e.g., History, Policy, Procedure)",
    "question": "String",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": Number (0-3),
    "explanation": "String explaining the correct answer."
  }
]
`;

      if (!process.env.GEMINI_API_KEY) {
        return new Response(
          "GEMINI_API_KEY is missing from environment variables. Please check your .env file.",
          { status: 500 },
        );
      }

      const res = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                id: { type: "NUMBER" },
                category: { type: "STRING" },
                question: { type: "STRING" },
                options: { type: "ARRAY", items: { type: "STRING" } },
                correct: { type: "NUMBER" },
                explanation: { type: "STRING" },
              },
              required: [
                "id",
                "category",
                "question",
                "options",
                "correct",
                "explanation",
              ],
            },
          },
        },
      });

      const response = await res;
      const quizzes = JSON.parse(response.text as string);

      // Record token usage
      if (response.usageMetadata) {
        await recordTokenUsage(user.id, "quiz-gen", response.usageMetadata);
      }
      console.log("quizzes: " + quizzes);
      await prisma.$transaction([
        prisma.usage.upsert({
          where: {
            userId: user.id,
          },
          update: {
            quizzesCount: {
              increment: 1,
            },
          },
          create: {
            userId: user.id,
            quizzesCount: 1,
            speechesCount: 0,
            debatesCount: 0,
            crisisCount: 0,
          },
        }),
        prisma.quiz.create({
          data: {
            userId: user.id,
            conferenceId: conference.id,
            questions: quizzes,
          },
        }),
      ]);

      return Response.json({ quizzes });
    } catch (error: any) {
      console.log("error: " + error);
      if (
        error.message?.includes("credentials") ||
        error.message?.includes("ADC")
      ) {
        return new Response(
          `AI Authentication Error: ${error.message}. Ensure GEMINI_API_KEY is valid.`,
          { status: 500 },
        );
      }
      return new Response(error.message || "An error has occured", {
        status: 500,
      });
    }
  },
);
