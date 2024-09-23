import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Navbar from "@/components/navbar/Navbar";
import prisma from "@/lib/prismaClient";

interface SLProps {
  children: React.ReactNode;
  params: { storeId: String };
}

export default async function StoreLayout({ children, params }: SLProps) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prisma.store.findFirst({
    where: {
      id: params.storeId as string,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
}
