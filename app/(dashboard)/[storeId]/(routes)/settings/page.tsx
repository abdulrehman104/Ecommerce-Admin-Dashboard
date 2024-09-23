import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prisma from "@/lib/prismaClient";
import SettingForm from "./components/SettingForm";

interface SProps {
  params: { storeId: String };
}
const Settings = async ({ params }: SProps) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prisma.store.findUnique({
    where: {
      userId,
      id: params.storeId as string,
    },
  });
  if (!store || store.userId !== userId) {
    redirect("/");
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-6 p-8 pt-6">
        <SettingForm initialData={store} />
      </div>
    </div>
  );
};

export default Settings;
