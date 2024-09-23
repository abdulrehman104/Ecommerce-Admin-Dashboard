import prisma from "@/lib/prismaClient";
import KitchensClients from "./components/KitchensClients";
import { KitchensColumns } from "./components/columns";
import { format } from "date-fns";

const Kitchens = async ({ params }: { params: { storeId: string } }) => {
  const kitchens = await prisma.kitchens.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedData: KitchensColumns[] = kitchens.map((items) => ({
    id: items.id,
    name: items.name,
    value: items.value,
    createdAt: format(items.createdAt, "MMMM do , yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <KitchensClients data={formatedData} />
      </div>
    </div>
  );
};

export default Kitchens;
