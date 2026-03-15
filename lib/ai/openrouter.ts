import { generateOutreachSuggestions } from "@/lib/ai/outreach";
import type { AiOutreachRequest, AiOutreachResponse } from "@/lib/ai/types";

const DEFAULT_MODEL = "openai/gpt-4o-mini";
const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";

function fallbackSuggestions(input: AiOutreachRequest): AiOutreachResponse {
  const suggestions = generateOutreachSuggestions({
    donorName: input.donorName?.trim() || "donor",
    bloodType: input.bloodType,
    urgency: input.urgency,
    requiredBy: input.requiredBy,
    donorStatus: input.approvalStatus ?? "approved",
    lastDonationDate: null,
    centreName: input.centreName,
    customNote: input.messageContext ?? null,
  });

  return {
    suggestions,
    provider: "fallback",
    model: DEFAULT_MODEL,
  };
}

function extractJsonObject(rawContent: string) {
  const cleaned = rawContent.replace(/```json|```/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model did not return JSON");
  }
  return cleaned.slice(start, end + 1);
}

function parseModelSuggestions(content: string) {
  const parsed = JSON.parse(extractJsonObject(content)) as {
    urgent?: unknown;
    reminder?: unknown;
    follow_up?: unknown;
  };

  if (
    typeof parsed.urgent !== "string" ||
    typeof parsed.reminder !== "string" ||
    typeof parsed.follow_up !== "string"
  ) {
    throw new Error("Invalid AI response shape");
  }

  return [
    `URGENT OUTREACH: ${parsed.urgent.trim()}`,
    `REMINDER MESSAGE: ${parsed.reminder.trim()}`,
    `FOLLOW-UP CONFIRMATION: ${parsed.follow_up.trim()}`,
  ];
}

export async function generateOpenRouterOutreachSuggestions(
  input: AiOutreachRequest,
): Promise<AiOutreachResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL;
  const baseUrl = (process.env.OPENROUTER_BASE_URL ?? DEFAULT_BASE_URL).replace(
    /\/+$/,
    "",
  );

  if (!apiKey) {
    return {
      ...fallbackSuggestions(input),
      error: "OPENROUTER_API_KEY is missing. Using fallback templates.",
    };
  }

  const systemPrompt =
    "You are an assistant for blood bank outreach in Jamaica. Return concise, practical donor communication copy.";
  const userPrompt = [
    "Generate 3 outreach variants in JSON only.",
    "Return this exact shape:",
    '{"urgent":"...", "reminder":"...", "follow_up":"..."}',
    "",
    `Blood type: ${input.bloodType}`,
    `Urgency: ${input.urgency}`,
    `Centre: ${input.centreName}`,
    `Required by: ${input.requiredBy}`,
    `Approval status: ${input.approvalStatus ?? "approved"}`,
    `Context: ${input.messageContext || "None provided"}`,
    "Keep each message under 55 words and include a clear call to action.",
  ].join("\n");

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter request failed (${response.status})`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("OpenRouter returned empty content");
    }

    return {
      suggestions: parseModelSuggestions(content),
      provider: "openrouter",
      model,
    };
  } catch (error) {
    const fallback = fallbackSuggestions(input);
    return {
      ...fallback,
      error:
        error instanceof Error
          ? `${error.message}. Using fallback templates.`
          : "OpenRouter request failed. Using fallback templates.",
    };
  }
}
