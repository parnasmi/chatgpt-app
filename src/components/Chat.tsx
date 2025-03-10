"use client";
import { useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCompletion } from "@/app/server-actions/getCompletion";

import { Transcript } from "./Transcript";
import { Message } from "@/types";
import { useRouter } from "next/navigation";

interface Props {
  id?: number | null;
  messages?: Message[];
}

export function Chat({ id = null, messages: initialMessages = [] }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [message, setMessage] = useState("");
  const chatId = useRef<number | null>(id);

  const router = useRouter();

  const onClick = async () => {
    setMessage("");
    const completions = await getCompletion(chatId.current, [
      ...messages,
      {
        role: "user",
        content: message,
      },
    ]);

    if (!chatId.current) {
      router.push(`/chats/${completions.id}`);
      router.refresh();
    }

    chatId.current = completions.id;
    setMessages(completions.messages);
  };

  return (
    <div className="flex flex-col">
      <Transcript messages={messages} truncate={false} />
      <div className="flex border-t-2 border-t-gray-500 pt-3 mt-3">
        <Input
          className="flex-grow text-xl"
          placeholder="Question"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              onClick();
            }
          }}
        />
        <Button onClick={onClick} className="ml-3 text-xl">
          Send
        </Button>
      </div>
    </div>
  );
}
