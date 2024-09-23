import prisma from "@/lib/prismaClient";

export const getProductCount = async (storeId: string) => {
  const productCount = await prisma.product.count({
    where: {
      storeId,
    },
  });

  return productCount;
};
