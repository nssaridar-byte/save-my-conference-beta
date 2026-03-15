import { AuthUser, withAuth } from "@/lib/auth";
import { ai } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { subscriptionValid } from "@/lib/subscription";
import { Subscription } from "@prisma/client";

export const GET = withAuth(
  async (
    req: Request,
    user: AuthUser,
    context: { params: Promise<{ id: string }> },
  ) => {
    try {
      const { id } = await context.params;

      const conference = await prisma.conference.findUnique({ where: { id } });
      const userObj = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        include: {
          subscription: true,
        },
      });
      if (!userObj) return new Response("User not found", { status: 404 });
      if (!conference)
        return new Response("Conference not found", { status: 404 });

      const usage = await prisma.usage.findUnique({
        where: {
          userId: user.id,
        },
      });
      // The user has a pro subscription if the user subscription is valid
      const isPro =
        userObj.subscription &&
        (await subscriptionValid(
          userObj.subscription as unknown as Subscription,
        ));
      // Check if the user doesn't have (the pro subscription or if he is on the free tier ) and that he has accumalated some usage

      if ((!isPro || userObj.role == "FREE") && usage) {
        // If the usage count including the one he is making is equal to the limit, update the limit hit at but still allow it to pass through

        if (usage.crisisCount + 1 >= 1) {
          await prisma.usage.update({
            where: {
              userId: user.id,
            },
            data: {
              crisisLimitHitAt: new Date(),
            },
          });
        }
        // If the speechesCount is more than or equal to 3, throw an error
        if (usage.crisisCount >= 1)
          return new Response("Usage limit reached", { status: 403 });
      }

      const prompt = `You are a Crisis Director for a Model United Nations (MUN) simulation. Your task is to generate exactly 3 subsequent crisis "updates" that follow a logical
      escalation or expansion of the situation described in the Initial Event, specifically tailored to the provided Committee Topic.
    2
    3 **Committee Topic:**
    4 ${conference.topic}
    5
    6 **Initial Event:**
    7 { severity: "HIGH", text: "Satellite telemetry indicates unexpected military movement near the 38th parallel.", region: "East Asia" }
    8
    9 **Instructions:**
   10 1. **Thematic Relevance:** Ensure every update is directly connected to the Committee Topic (e.g., if the topic is "Nuclear Non-Proliferation," focus the updates
      on warheads or inspections).
   11 2. **Progression:** Each update should feel like a "breaking news" headline.
   12 3. **Escalation:** At least one update should be "CRITICAL".
   13 4. **Specificity:** Mention specific actors, diplomatic actions, or humanitarian impacts (e.g., troop crossings, cyberattacks, emergency UNSC sessions).
   14 5. **Output Format:** Return ONLY a JSON array containing 3 objects with keys: "severity", "text", and "region".
   15
   16 **Schema Example:**
   17 [
   18   { "severity": "...", "text": "...", "region": "..." }
   19 ]`;

      const response = ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                severity: {
                  type: "string",
                  enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
                },
                text: {
                  type: "string",
                },
                region: {
                  type: "string",
                },
              },
              required: ["severity", "text", "region"],
            },
          },
        },
      });

      const crisis = JSON.parse((await response).text as string);
      console.log(crisis);

      await prisma.usage.update({
        where: {
          userId: user.id,
        },
        data: {
          crisisCount: {
            increment: 1,
          },
        },
      });
      return Response.json({ crisis });
    } catch (error) {
      console.log(error);
      return new Response("An error has occured", { status: 50 });
    }
  },
);
