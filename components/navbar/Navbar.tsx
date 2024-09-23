import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import StoreSwitcher from "@/components/navbar/StoreSwitcher";
import NavLinks from "@/components/navbar/NavLinks";
import prisma from "@/lib/prismaClient";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prisma.store.findMany({
    where: { userId },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 ">
        {/* ComboBox */}
        <StoreSwitcher items={stores} />

        {/* Routes */}
        <NavLinks className="mx-6" />

        {/* User Button */}
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
