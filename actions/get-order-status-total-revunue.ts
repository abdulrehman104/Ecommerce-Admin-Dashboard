import prisma from "@/lib/prismaClient";

interface GraphData {
  name: string;
  total: number;
}

export const getOrderStatusTotalRevenue = async (
  storeId: string,
): Promise<GraphData[]> => {
  const ordersData = await prisma.order.findMany({
    where: { storeId },
    include: {
      orderItems: {
        include: {
          product: true, // Including product to access price
        },
      },
    },
  });

  const statusRevenue: { [key: string]: number } = {};

  for (const order of ordersData) {
    const status = order.orderStatus;

    if (status) {
      let revenueForOrder = 0;

      for (const item of order.orderItems) {
        revenueForOrder += item.product.price.toNumber();
      }

      statusRevenue[status] = (statusRevenue[status] || 0) + revenueForOrder;
    }
  }

  // Create a map to convert order statuses to numeric representation (if needed)
  const statusMap: { [key: string]: number } = {
    Processing: 0,
    Delivering: 1,
    Delivered: 2,
    Canceled: 3,
  };

  // Update graphData using the status map
  const graphData: GraphData[] = Object.keys(statusMap).map((statusName) => ({
    name: statusName,
    total: statusRevenue[statusName] || 0,
  }));

  return graphData;
};
