import { NextRequest, NextResponse } from "next/server";
import { validateRequest, hashRequest } from "@/lib/validator";
import { checkRateLimit } from "@/lib/rate-limiter";
import { getCached, setCache } from "@/lib/cache";
import { callDeepSeek } from "@/lib/deepseek";
import { buildSystemPrompt, buildUserMessage } from "@/lib/prompt";

export async function POST(request: NextRequest) {
  // 1. Extract client identity for rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";
  const fingerprint = request.headers.get("x-fingerprint") || undefined;

  // 2. Rate limit check
  const rateCheck = checkRateLimit(ip, fingerprint);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded. Please try again later.",
        retryAfter: "Check X-RateLimit-Reset header",
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": new Date(
            Date.now() + 60_000
          ).toISOString(),
        },
      }
    );
  }

  // 3. Parse and validate input
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const validation = validateRequest(body);
  if (!validation.valid || !validation.data) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 }
    );
  }

  const req = validation.data;

  // 4. Check cache
  const cacheKey = hashRequest(req);
  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
      headers: {
        "X-Cache": "HIT",
        "X-RateLimit-Remaining": String(rateCheck.remainingMinute),
      },
    });
  }

  // 5. Build prompts and call DeepSeek
  try {
    const systemPrompt = buildSystemPrompt();
    const userMessage = buildUserMessage(req);
    const rawResponse = await callDeepSeek(systemPrompt, userMessage, 1500);

    // 6. Parse AI response
    let parsed: unknown;
    try {
      let jsonStr = rawResponse.trim();
      // Handle markdown code block wrapping
      const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1].trim();
      }
      parsed = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse DeepSeek response:", parseError);
      console.error("Raw response (first 500 chars):", rawResponse.slice(0, 500));
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    // 7. Validate response structure
    const data = parsed as Record<string, unknown>;
    if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length !== 3) {
      return NextResponse.json(
        { error: "AI returned invalid response structure. Please try again." },
        { status: 500 }
      );
    }

    // 8. Cache and return
    setCache(cacheKey, data);

    return NextResponse.json(data, {
      headers: {
        "X-Cache": "MISS",
        "X-RateLimit-Remaining": String(rateCheck.remainingMinute),
      },
    });
  } catch (error: unknown) {
    console.error("DeepSeek API error:", error);
    return NextResponse.json(
      { error: "Name generation service is temporarily unavailable. Please try again in a moment." },
      { status: 503 }
    );
  }
}
