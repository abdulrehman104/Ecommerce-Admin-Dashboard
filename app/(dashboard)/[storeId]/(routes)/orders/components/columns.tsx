"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CallAction from "./CallAction";

export type OrderColumns = {
  id: string;
  products: string;
  phone: string;
  adress: string;
  total_price: string;
  isPaid: boolean;
  order_status: string;
};

export const columns: ColumnDef<OrderColumns>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "adress",
    header: "Adress",
  },
  {
    accessorKey: "total_price",
    header: "Amount",
  },

  {
    accessorKey: "order_status",
    header: "Status",
    cell: ({ row }) => {
      const { order_status } = row.original;

      return (
        <p
          className={cn(
            "text-base font-semibold",
            (order_status === "Delivering" && "text-yellow-500") ||
              (order_status === "Delivered" && "text-emerald-500") ||
              (order_status === "Canceled" && "text-red-500"),
          )}
        >
          {order_status}
        </p>
      );
    },
  },
  {
    accessorKey: "isPaid",
    header: "Payment Status",
    cell: ({ row }) => {
      const { isPaid } = row.original;

      return (
        <p
          className={cn(
            "text-base font-semibold",
            isPaid ? "text-emerald-500" : "text-red-500",
          )}
        >
          {isPaid ? "Paid" : "Not Paid"}
        </p>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <CallAction data={row.original} />,
  },
];
