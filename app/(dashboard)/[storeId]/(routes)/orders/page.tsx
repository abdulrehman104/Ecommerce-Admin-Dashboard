import prisma from "@/lib/prismaClient";

import OrdersClients from "./components/OrdersClients";
import { OrderColumns } from "./components/columns";

import { format } from "date-fns";
import { formatter } from "@/lib/utils";

const Orders = async ({ params }: { params: { storeId: string } }) => {
  const ordersData = await prisma.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedData: OrderColumns[] = ordersData.map((items) => ({
    id: items.id,
    isPaid: items.isPaid,
    phone: items.phone,
    adress: items.adress,
    products: items.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    order_status: items.orderStatus,
    total_price: formatter.format(
      items.orderItems.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0),
    ),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrdersClients data={formatedData} />
      </div>
    </div>
  );
};

export default Orders;
