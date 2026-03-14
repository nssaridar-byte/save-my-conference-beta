import { AuthUser, withAuth } from "@/lib/auth";
import { ai } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
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
      const isPro =
        userObj.subscription &&
        (await subscriptionValid(
          userObj.subscription as unknown as Subscription,
        ));

      console.log("pro: " + isPro);

      if (!isPro && usage && userObj.role == "FREE") {
        if (usage.quizzesCount + 1 == 5) {
          await prisma.usage.update({
            where: {
              userId: user.id,
            },
            data: {
              quizzesLimitHitAt: new Date(),
            },
          });
        }
        if (usage.quizzesCount >= 5)
          return new Response("Usage limit reached", { status: 403 });
      }
      const conference = await prisma.conference.findUnique({
        where: {
          id,
        },
      });

      if (!conference) return new Response("Conference not found");
      const quizes = await prisma.quiz.findMany({
        where: {
          conferenceId: id,
        },
        select: {
          questions: true,
        },
      });
      const prompt = `You are an expert Model United Nations (MUN) Director and Educational Content Creator. Your task is to generate challenging, educational multiple-choice quiz questions based on the provided conference topic.

CONFERENCE TOPIC:
"${conference.topic}"

REQUIREMENTS:
1. Generate exactly 5 multiple-choice questions.
2. Cover a mix of historical context, key stakeholders, current challenges, and relevant MUN parliamentary procedure related to the topic.
3. Provide exactly 4 options for each question.
4. The "correct" field must be the 0-based index of the correct answer in the "options" array (0, 1, 2, or 3).
5. Provide a clear, educational explanation for why the answer is correct.

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

${
  quizes.length > 0 &&
  `MAKE SURE TO NOT INCLUDE ANY OF THE FOLLOWING QUESTIONS OR QUESTIONS SIMILLAR TO THEM:
    ${quizes.map((quiz: any) => quiz.questions.map((q: any) => q.question))}
  `
}
`;

      const res = ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
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

      const quizzes = JSON.parse((await res).text as string);
      console.log(quizzes);
      prisma.$transaction([
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
    } catch (error) {
      console.log(error);
      return new Response("An error has occured", { status: 500 });
    }
  },
);
