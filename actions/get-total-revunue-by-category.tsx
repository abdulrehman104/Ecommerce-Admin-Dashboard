import prisma from "@/lib/prismaClient";

interface GraphData {
  name: string;
  total: number;
}

export const getOrderTotalRevenueByCategory = async (
  storeId: string,
): Promise<GraphData[]> => {
  const ordersData = await prisma.order.findMany({
    where: { storeId },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              category: true, // Including category in the product relation
            },
          },
        },
      },
    },
  });

  const categories = await prisma.category.findMany({
    where: { storeId },
  });

  const categoryRevenue: { [key: string]: number } = {};

  for (const order of ordersData) {
    for (const item of order.orderItems) {
      const category = item.product.category?.name;

      if (category) {
        const revenueForItem = item.product.price.toNumber(); // Assuming each OrderItem is for one product

        categoryRevenue[category] =
          (categoryRevenue[category] || 0) + revenueForItem;
      }
    }
  }

  // Ensure all categories are represented in the final graph data
  for (const category of categories) {
    categoryRevenue[category.name] = categoryRevenue[category.name] || 0;
  }

  // Update graphData using the categories array
  const graphData: GraphData[] = categories.map((category) => ({
    name: category.name,
    total: categoryRevenue[category.name] || 0,
  }));

  return graphData;
};
