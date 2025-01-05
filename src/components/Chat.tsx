"use client";
import { useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCompletion } from "@/app/server-actions/getCompletion";
import { Transcript } from "./Transcript";
import { Message } from "@/types";

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const chatId = useRef<number | null>(null);

  const onClick = async () => {
    setMessage("");
    const completions = await getCompletion(chatId.current, [
      ...messages,
      {
        role: "user",
        content: message,
      },
    ]);
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
