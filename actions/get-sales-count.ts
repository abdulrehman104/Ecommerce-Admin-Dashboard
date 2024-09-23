import prisma from "@/lib/prismaClient";

export const getSalesCount = async (storeId: string) => {
  const salesCount = await prisma.order.count({
    where: {
      storeId: storeId,
      isPaid: true,
    },
  });

  return salesCount;
};
