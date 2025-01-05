"use client";
import { useEffect, useRef, useState } from "react";

import type { Message as AIMessage } from "ai";
import { useChat } from "ai/react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Transcript } from "./Transcript";
import { Message } from "@/types";
import { useRouter } from "next/navigation";
import { updateChat } from "@/app/server-actions/updateChat";

interface Props {
  id?: number | null;
  messages?: Message[];
}

export function Chat({ id = null, messages: initialMessages = [] }: Props) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages: initialMessages as unknown as AIMessage[],
    });

  const chatId = useRef<number | null>(id);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (!isLoading && messages.length) {
        const simplifiedMessages = messages.map((message) => ({
          role: message.role as "user" | "assistant",
          content: message.content,
        }));
        const newChatId = await updateChat(chatId.current, simplifiedMessages);
        if (chatId.current === null) {
          router.push(`/chats/${newChatId}`);
          router.refresh();
        } else {
          chatId.current = newChatId;
        }
      }
    })();
  }, [isLoading, messages, router]);

  return (
    <div className="flex flex-col">
      <Transcript messages={messages as Message[]} truncate={false} />
      <form className="flex mt-3" onSubmit={handleSubmit}>
        <Input
          className="flex-grow text-xl"
          placeholder="Question"
          value={input}
          onChange={handleInputChange}
          autoFocus
        />
        <Button type="submit" className="ml-3 text-xl">
          Send
        </Button>
      </form>
    </div>
  );
}
