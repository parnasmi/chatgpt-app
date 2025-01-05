import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 3000;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-3.5-turbo"),
    system: "You are a helpful assistant.",
    messages,
  });

  return result.toDataStreamResponse();
}
