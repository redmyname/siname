import OpenAI from "openai";

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});

export async function callDeepSeek(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 800
): Promise<string> {
  const response = await deepseek.chat.completions.create(
    {
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
      response_format: { type: "json_object" },
    },
    {
      timeout: 30000,
    }
  );

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("DeepSeek returned empty response");
  }
  return content;
}
