import prisma from "@/lib/prismaClient";

export const getTotalRevenue = async (storeId: string) => {
  // Fetch orders with related orderItems where the order is paid
  const orders = await prisma.order.findMany({
    where: {
      storeId: storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  // Calculate total revenue
  const totalRevenue = orders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      return orderSum + item.product.price.toNumber();
    }, 0);
    return total + orderTotal;
  }, 0);

  return totalRevenue;
};
