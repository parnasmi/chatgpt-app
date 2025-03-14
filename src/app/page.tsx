import { Chat } from "@/components/Chat";
import { PreviousChats } from "@/components/PreviousChats";
import { Separator } from "@/components/ui/separator";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

export default async function Home() {
  const session = await getServerSession();

  return (
    <main className="p-5">
      <h1 className="text-4xl font-bold">Welcome To GPT Chat!</h1>
      <Suspense fallback={<div>Loading Previous Chats</div>}>
        <PreviousChats />
      </Suspense>
      {!session?.user?.email && <div>You need to log in to use this chat.</div>}
      {session?.user?.email && (
        <>
          <Separator className="my-5" />
          <Chat />
        </>
      )}
    </main>
  );
}
