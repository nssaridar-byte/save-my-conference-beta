import { ai } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { recordTokenUsage } from "@/lib/token-usage";
import { withAuth } from "@/lib/auth";

export const POST = withAuth(async (req, user) => {
  try {
    const { conferenceId, content } = await req.json();

    if (!conferenceId || !content) {
      return new Response("Missing conferenceId or content", { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return new Response("GEMINI_API_KEY is missing", { status: 500 });
    }

    const prompt = `You are an expert Model United Nations (MUN) research analyst. 
    Analyze the following research document for a conference and identify which of the three critical MUN pillars are missing:
    1. Policy (The country's official position, diplomatic relations, and past voting record)
    2. History (Historical background of the topic and previous UN involvements/resolutions)
    3. Solutions (Actionable, realistic proposals and implementation mechanisms)

    Return ONLY a JSON object with the following structure:
    {
      "missingSections": ["Policy", "History", "Solutions"], // Only include the ones actually missing
      "readinessScore": 85 // A score from 0-100 based on the depth of the content
    }

    Research Content:
    """${content}"""`;

    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash", // Using 1.5 flash as it's the standard/best for this task
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const response = await result;
    const analysis = JSON.parse(response.text as string);

    // Record token usage
    if (response.usageMetadata) {
      await recordTokenUsage(user.id, "dashboard-gap-analysis", response.usageMetadata);
    }

    return Response.json(analysis);
  } catch (error: any) {
    console.error("Gap Analysis Error:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
});
