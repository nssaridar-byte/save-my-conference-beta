import { AuthUser, withAuth } from "@/lib/auth";
import { ai } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { recordTokenUsage } from "@/lib/token-usage";
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

      if (!process.env.GEMINI_API_KEY) {
        return new Response("GEMINI_API_KEY is missing.", { status: 500 });
      }

      const { searchParams } = new URL(req.url);
      const difficulty = searchParams.get("difficulty") || "Advanced";

      const conferenceId = String(id);
      console.log(`[CRISIS_GEN] Initializing for conference: ${conferenceId}`);

      const conference = await prisma.conference.findUnique({ 
        where: { id: conferenceId } 
      });
      const userObj = await prisma.user.findUnique({
        where: { id: String(user.id) },
        include: { subscription: true },
      });

      if (!userObj) return new Response("User not found", { status: 404 });
      if (!conference)
        return new Response("Conference not found", { status: 404 });

      const usage = await prisma.usage.findUnique({
        where: { userId: user.id },
      });

      const isPro =
        userObj.subscription &&
        (await subscriptionValid(
          userObj.subscription as unknown as Subscription,
        ));

      if ((!isPro || userObj.role == "FREE") && usage) {
        if (usage.crisisCount + 1 >= 100) {
          await prisma.usage.update({
            where: { userId: user.id },
            data: { crisisLimitHitAt: new Date() },
          });
        }
        if (usage.crisisCount >= 100)
          return new Response("Usage limit reached", { status: 403 });
      }

      // Intelligence Gathering
      const speeches = await prisma.speech.findMany({
        where: { userId: user.id, conferenceId: id },
        select: { feedback: true },
      });

      // Intelligence Gathering with relation include for robustness
      const conferenceWithFiles = await prisma.conference.findUnique({
        where: { id },
        include: {
          file: {
            where: { isSelected: true },
            select: { name: true },
          },
        },
      });

      let research = conferenceWithFiles?.file || [];

      // Fallback if no files selected
      if (research.length === 0) {
        const conferenceAllFiles = await prisma.conference.findUnique({
          where: { id },
          include: {
            file: {
              select: { name: true },
            },
          },
        });
        research = conferenceAllFiles?.file || [];
      }


      const weakPoints = speeches
        .map((s: any) => s.feedback?.feedback?.weaknesses || [])
        .flat()
        .slice(0, 5);

      const researchNames = research.map((f: any) => f.name).join(", ");

      const prompt = `You are an Elite MUN Crisis Director. 
      Create a "Precision Intelligence Simulation" for the delegate of ${conference.country} in ${conference.committee} on the topic of "${conference.topic}".

      DIFFICULTY LEVEL: ${difficulty}
      (Beginner: Linear/Clear | Advanced: Complex/Multilateral | Chaos: Extreme/Unpredictable)

      INTELLIGENCE CONTEXT:
      - Research Dossier: ${researchNames || "Standard Intelligence"}
      - Delegate Vulnerabilities: ${weakPoints.length > 0 ? weakPoints.join(", ") : "No specific weaknesses found."}

      Your task is to generate a comprehensive crisis narrative that specifically targets ${conference.country} and its known geopolitical rivals.

      REQUIREMENTS:
      1. Scenario Title: A high-stakes operation name.
      2. Threat Actors: Identify 2 specific countries or organizations that are acting against the delegate's interests.
      3. Global Context: A one-sentence briefing on the geopolitical climate.
      4. Initial Event: The catalyst.
      5. Updates: A sequence of 3 rapidly escalating follow-up events.

      OUTPUT FORMAT:
      Return ONLY a JSON object with this structure:
      {
        "scenario_title": "...",
        "threat_actors": ["...", "..."],
        "global_context": "...",
        "initial_event": { "severity": "HIGH", "text": "...", "region": "..." },
        "updates": [
          { "severity": "...", "text": "...", "region": "..." },
          { "severity": "...", "text": "...", "region": "..." },
          { "severity": "CRITICAL", "text": "...", "region": "..." }
        ]
      }`;

      const result = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              scenario_title: { type: "STRING" },
              threat_actors: { type: "ARRAY", items: { type: "STRING" } },
              global_context: { type: "STRING" },
              initial_event: {
                type: "OBJECT",
                properties: {
                  severity: { type: "STRING" },
                  text: { type: "STRING" },
                  region: { type: "STRING" }
                },
                required: ["severity", "text", "region"]
              },
              updates: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    severity: { type: "STRING" },
                    text: { type: "STRING" },
                    region: { type: "STRING" }
                  },
                  required: ["severity", "text", "region"]
                }
              }
            },
            required: ["scenario_title", "threat_actors", "global_context", "initial_event", "updates"]
          }
        },
      });

      const aiResponse = await result;
      let data;
      try {
        data = JSON.parse(aiResponse.text as string);
      } catch (e) {
        console.error("[CRISIS_GEN] Failed to parse AI response:", aiResponse.text);
        return new Response("AI generated invalid data. Please try again.", { status: 500 });
      }

      if (aiResponse.usageMetadata) {
        await recordTokenUsage(user.id, "crisis-gen", aiResponse.usageMetadata);
      }

      const crisisRecord = await prisma.crisis.create({
        data: {
          userId: user.id,
          conferenceId: id,
          events: data,
        },
      });

      await prisma.usage.upsert({
        where: { userId: user.id },
        update: { crisisCount: { increment: 1 } },
        create: { userId: user.id, crisisCount: 1 },
      });

      return Response.json({
        ...data,
        crisisId: crisisRecord.id,
        intelligence: {
          weakPoints,
          difficulty
        }
      });
    } catch (error: any) {
      console.error("[CRISIS_GEN] Error:", error);
      return new Response(`Simulation Error: ${error.message || "An unexpected error occurred"}.`, { status: 500 });
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

      if (!process.env.GEMINI_API_KEY) {
        return new Response("GEMINI_API_KEY is missing.", { status: 500 });
      }

      const conferenceId = String(id);
      const conference = await prisma.conference.findUnique({
        where: { id: conferenceId },
      });
      if (!conference)
        return new Response("Conference not found", { status: 404 });

      const userObj = await prisma.user.findUnique({
        where: { id: String(user.id) },
        include: { subscription: true },
      });
      if (!userObj) return new Response("User not found", { status: 404 });

      const { crisis, response, crisisId } = await req.json();

      if (!crisis || !response)
        return new Response("Invalid request", { status: 400 });

      const prompt = `You are a Senior Crisis Director for a Model United Nations simulation.
     A delegate has submitted a **Comprehensive Directive** responding to a series of rapidly escalating crisis events.
    
     CONTEXT:
     - **Committee Topic:** ${conference.topic}
     - **Delegate's Country:** ${conference.country}
    THE CRISIS TIMELINE:
     1. ${crisis.initial_event.text} (${crisis.initial_event.severity})
     2. ${crisis.updates[0].text} (${crisis.updates[0].severity})
    3. ${crisis.updates[1].text} (${crisis.updates[1].severity})
    4. ${crisis.updates[2].text} (${crisis.updates[2].severity})
   
    TASK:
    Evaluate the delegate's directive. A high-quality response must:
    1. **Prioritize:** Address the most severe threats first.
    2. **Integrate:** Show how the solutions for one event don't conflict with another.
   3. **Detail:** Provide specific diplomatic, economic, or military actions.
   
    OUTPUT RULES:
    1. Return ONLY a valid JSON object.
   
    JSON STRUCTURE:
    {
      "overall_grade": "A-F",
      "total_score": 0,
      "master_verdict": "Stable | Fragile | Chaos | Total Collapse",
      "event_outcomes": [
        { "event_id": 0, "status": "Resolved | Escalated | Ongoing", "impact_note": "Result of Initial Event." },
        { "event_id": 1, "status": "Resolved | Escalated | Ongoing", "impact_note": "Result of Update 1." },
        { "event_id": 2, "status": "Resolved | Escalated | Ongoing", "impact_note": "Result of Update 2." },
        { "event_id": 3, "status": "Resolved | Escalated | Ongoing", "impact_note": "Result of Update 3." }
      ],
      "feedback": {
        "strengths": ["..."],
        "weaknesses": ["..."],
        "strategic_tip": "..."
      },
      "in_character_briefing": "..."
    }
   
    DELEGATE RESPONSE:
    """${response}"""`;

      const result = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              overall_grade: { type: "STRING" },
              total_score: { type: "NUMBER" },
              master_verdict: { type: "STRING" },
              event_outcomes: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    event_id: { type: "NUMBER" },
                    status: { type: "STRING" },
                    impact_note: { type: "STRING" },
                  },
                  required: ["event_id", "status", "impact_note"],
                },
              },
              feedback: {
                type: "OBJECT",
                properties: {
                  strengths: { type: "ARRAY", items: { type: "STRING" } },
                  weaknesses: { type: "ARRAY", items: { type: "STRING" } },
                  strategic_tip: { type: "STRING" },
                },
                required: ["strengths", "weaknesses", "strategic_tip"],
              },
              in_character_briefing: { type: "STRING" },
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

      const aiFeedbackResponse = await result;
      let feedback;
      try {
        feedback = JSON.parse(aiFeedbackResponse.text as string);
      } catch (e) {
        console.error("[CRISIS_EVAL] Failed to parse AI feedback:", aiFeedbackResponse.text);
        return new Response("AI generated invalid evaluation. Please try again.", { status: 500 });
      }

      if (aiFeedbackResponse.usageMetadata) {
        await recordTokenUsage(user.id, "crisis-eval", aiFeedbackResponse.usageMetadata);
      }

      if (crisisId) {
        await prisma.crisis.update({
          where: { id: crisisId },
          data: {
            response,
            evaluation: feedback,
          },
        });
      }

      return Response.json({ feedback });
    } catch (error: any) {
      console.error("[CRISIS_EVAL] Error:", error);
      return new Response(`Simulation Error: ${error.message || "An unexpected error occurred"}.`, { status: 500 });
    }
  },
);
