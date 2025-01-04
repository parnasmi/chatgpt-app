import { Chat } from "@/components/Chat";
import { getChat } from "@/db";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type TParams = Promise<{ chatId: string[] }>;

interface Props {
  params: TParams;
}

export default async function ChatDetail({ params }: Props) {
  const { chatId } = await params;

  const chat = await getChat(+chatId);
  const session = await getServerSession();

  if (!chat) {
    return notFound();
  }

  if (!session || (session && session?.user?.email) !== chat.user_email) {
    return redirect("/");
  }

  return (
    <main className="pt-5">
      <Chat id={+chatId} key={+chatId} messages={chat?.messages || []} />
    </main>
  );
}
