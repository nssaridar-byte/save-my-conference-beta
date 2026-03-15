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
        model: "gemini-3-flash-preview",
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
      console.log("user id: " + user.id);

      await prisma.usage.upsert({
        where: {
          userId: user.id,
        },
        update: {
          crisisCount: {
            increment: 1,
          },
        },
        create: {
          userId: user.id,
          crisisCount: 1,
        },
      });
      return Response.json({ crisis });
    } catch (error) {
      console.log(error);
      return new Response("An error has occured", { status: 500 });
    }
  },
);
export const POST = withAuth(
  async (
    req: Request,
    user: AuthUser,
    context: { params: Promise<{ id: string }> },
  ) => {
    try {
      const { id } = await context.params;

      const conference = await prisma.conference.findUnique({
        where: { id },
      });

      if (!conference)
        return new Response("Conference not found", { status: 404 });

      const userObj = await prisma.user.findUnique({
        where: { id: user.id },
        include: { subscription: true },
      });
      if (!userObj) return new Response("User not found", { status: 404 });

      const { crisis, response } = await req.json();

      if (!crisis || !response)
        return new Response("Invalid request", { status: 400 });

      const prompt = `You are a Senior Crisis Director for a Model United Nations simulation.
     A delegate has submitted a **Comprehensive Directive** responding to a series of three rapidly escalating crisis events.
    
     CONTEXT:
     - **Committee Topic:** ${conference.topic}
     - **Delegate's Country:** ${conference.country}
    THE CRISIS TIMELINE (The delegate must address all three):
     1. ${crisis[0].text} (${crisis[0].severity})
    2. ${crisis[1].text} (${crisis[1].severity})
    3. ${crisis[2].text} (${crisis[2].severity})
   
    TASK:
    Evaluate the delegate's directive. A high-quality response must:
    1. **Prioritize:** Address the most severe (CRITICAL/HIGH) threats first.
    2. **Integrate:** Show how the solutions for one event don't conflict with another.
   3. **Detail:** Provide specific diplomatic, economic, or military actions for each point.
   
    SCORING CRITERIA (1-10):
    - **Crisis Coverage:** Did they meaningfully address all 3 events? (1-10)
    - **Strategic Depth:** Are the solutions interconnected and logical? (1-10)
    - **Diplomatic Realism:** Does it respect international law and country policy? (1-10)
    - **Urgency Management:** Did they handle the highest severity event effectively? (1-10)
   
    OUTPUT RULES:
    1. Return ONLY a valid JSON object.
    2. Provide a "Master Verdict" on the overall stability of the region.
    3. Provide a brief "Status Report" for EACH of the three crisis events based on their response.
   
    JSON STRUCTURE:
    {
      "overall_grade": "A-F",
      "total_score": 0,
      "master_verdict": "Stable | Fragile | Chaos | Total Collapse",
      "event_outcomes": [
        { "event_id": 1, "status": "Resolved | Escalated | Ongoing", "impact_note": "1-sentence on the result of their specific action for Event 1." },
        { "event_id": 2, "status": "Resolved | Escalated | Ongoing", "impact_note": "1-sentence on the result of their specific action for Event 2." },
        { "event_id": 3, "status": "Resolved | Escalated | Ongoing", "impact_note": "1-sentence on the result of their specific action for Event 3." }
      ],
      "feedback": {
        "strengths": ["Concise strength 1", "Concise strength 2"],
        "weaknesses": ["Concise weakness 1", "Concise weakness 2"],
        "strategic_tip": "One high-level tip on how to better manage simultaneous crises."
      },
      "in_character_briefing": "A 3-sentence urgent summary from the Situation Room regarding the new state of the world."
    }
   
    DELEGATE RESPONSE:
    """${response}"""`;

      const feedbackUnparsed = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              overall_grade: {
                type: "string",
              },
              total_score: {
                type: "number",
              },
              master_verdict: {
                type: "string",
              },
              event_outcomes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    event_id: {
                      type: "number",
                    },
                    status: {
                      type: "string",
                    },
                    impact_note: {
                      type: "string",
                    },
                  },
                  required: ["event_id", "status", "impact_note"],
                },
              },
              feedback: {
                type: "object",
                properties: {
                  strengths: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  weaknesses: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  strategic_tip: {
                    type: "string",
                  },
                },
                required: ["strengths", "weaknesses", "strategic_tip"],
              },
              in_character_briefing: {
                type: "string",
              },
            },
            required: [
              "overall_grade",
              "total_score",
              "master_verdict",
              "event_outcomes",
              "feedback",
              "in_character_briefing",
            ],
          },
        },
      });

      const feedback = JSON.parse((await feedbackUnparsed).text as string);

      return Response.json({ feedback });
    } catch (error) {
      return new Response("An error has occured", { status: 500 });
    }
  },
);
