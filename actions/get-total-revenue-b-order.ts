import prisma from "@/lib/prismaClient";

interface GraphData {
  name: string;
  total: number;
}

export const getOrderPaymentStatusTotalRevenue = async (
  storeId: string,
): Promise<GraphData[]> => {
  const ordersData = await prisma.order.findMany({
    where: { storeId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const statusRevenue: { [key: string]: number } = {};

  for (const order of ordersData) {
    const status = order.isPaid ? "Paid" : "Not Paid";

    let revenueForOrder = 0;

    for (const item of order.orderItems) {
      revenueForOrder += item.product.price.toNumber();
    }

    statusRevenue[status] = (statusRevenue[status] || 0) + revenueForOrder;
  }

  // Create a map to convert payment status to numeric representation (if needed)
  const statusMap: { [key: string]: number } = {
    Paid: 0,
    "Not Paid": 1,
  };

  // Update the graph data
  const graphData: GraphData[] = Object.keys(statusMap).map((statusName) => ({
    name: statusName,
    total: statusRevenue[statusName] || 0,
  }));

  return graphData;
};
