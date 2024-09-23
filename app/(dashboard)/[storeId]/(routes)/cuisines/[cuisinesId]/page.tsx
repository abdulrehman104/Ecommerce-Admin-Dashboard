import prisma from "@/lib/prismaClient";
import CuisinesForm from "./components/CuisinesForm";

const CuisinesPage = async ({ params }: { params: { cuisinesId: string } }) => {
  const cuisines = await prisma.cuisines.findUnique({
    where: {
      id: params.cuisinesId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CuisinesForm initialData={cuisines} />
      </div>
    </div>
  );
};

export default CuisinesPage;
