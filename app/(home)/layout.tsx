import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prisma from "@/lib/prismaClient";

interface HLProps {
  children: React.ReactNode;
}

export default async function HomeLayout({ children }: HLProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prisma.store.findFirst({
    where: {
      userId,
    },
  });

  if (store) {
    redirect(`/${store?.id}`);
  }

  return <div>{children}</div>;
}
