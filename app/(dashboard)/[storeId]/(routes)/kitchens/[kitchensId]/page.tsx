import prisma from "@/lib/prismaClient";
import KitchenForm from "./components/KitchenForm";

const KitchensPage = async ({ params }: { params: { kitchensId: string } }) => {
  const kitchens = await prisma.kitchens.findUnique({
    where: {
      id: params.kitchensId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <KitchenForm initialData={kitchens} />
      </div>
    </div>
  );
};

export default KitchensPage;
