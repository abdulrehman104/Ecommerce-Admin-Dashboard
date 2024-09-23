import prisma from "@/lib/prismaClient";
import SizeClients from "./components/SizeClients";
import { SizeColumns } from "./components/columns";
import { format } from "date-fns";

const Sizes = async ({ params }: { params: { storeId: string } }) => {
  const sizes = await prisma.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedData: SizeColumns[] = sizes.map((items) => ({
    id: items.id,
    name: items.name,
    value: items.value,
    createdAt: format(items.createdAt, "MMMM do , yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClients data={formatedData} />
      </div>
    </div>
  );
};

export default Sizes;
