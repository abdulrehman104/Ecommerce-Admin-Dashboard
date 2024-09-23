import prisma from "@/lib/prismaClient";
import BillboardClients from "./components/BillboardClients";
import { BillboardColumns } from "./components/columns";
import { format } from "date-fns";

const Billboards = async ({ params }: { params: { storeId: string } }) => {
  const billboardsData = await prisma.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedData: BillboardColumns[] = billboardsData.map((items) => ({
    id: items.id,
    label: items.label,
    imageUrl: items.imageUrl,
    createdAt: format(items.createdAt, "MMMM do , yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClients data={formatedData} />
      </div>
    </div>
  );
};

export default Billboards;
