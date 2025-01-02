"use server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("open ai key", process.env.OPENAI_API_KEY);

type MessageHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

export async function getCompletion(messageHistory: MessageHistoryItem[]) {
  // function implementation will be here

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messageHistory,
  });

  const messages = [
    ...messageHistory,
    response.choices[0].message as unknown as {
      role: "user" | "assistant";
      content: string;
    },
  ];

  return { messages };
}
