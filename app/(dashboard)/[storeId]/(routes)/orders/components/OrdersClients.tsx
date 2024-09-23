"use client";

import Heading from "@/components/Heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { OrderColumns, columns } from "./columns";

interface OCProps {
  data: OrderColumns[];
}
const OrdersClients = ({ data }: OCProps) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />
      <div>
        <Separator />

        <DataTable searchKey="product" columns={columns} data={data} />
      </div>
    </>
  );
};

export default OrdersClients;
