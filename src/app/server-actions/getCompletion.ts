"use server";
import OpenAI from "openai";

import { createChat, updateChat } from "@/db";

import { getServerSession } from "next-auth";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type MessageHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

export async function getCompletion(
  id: number | null,
  messageHistory: MessageHistoryItem[]
) {
  const session = await getServerSession();

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

  let chatId = id;
  if (!chatId) {
    chatId = await createChat(
      session?.user?.email || "",
      messageHistory[0].content,
      messages
    );
  } else {
    await updateChat(chatId, messages);
  }

  return {
    messages,
    id: chatId,
  };
}
