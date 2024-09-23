import prisma from "@/lib/prismaClient";
import CuisinesClient from "./components/CuisinesClient";
import { CuisinesColumns } from "./components/columns";
import { format } from "date-fns";

const Kitchens = async ({ params }: { params: { storeId: string } }) => {
  const cuisines = await prisma.cuisines.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedData: CuisinesColumns[] = cuisines.map((items) => ({
    id: items.id,
    name: items.name,
    value: items.value,
    createdAt: format(items.createdAt, "MMMM do , yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CuisinesClient data={formatedData} />
      </div>
    </div>
  );
};

export default Kitchens;
