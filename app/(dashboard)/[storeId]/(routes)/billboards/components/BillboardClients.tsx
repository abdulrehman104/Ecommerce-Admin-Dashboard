"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/Heading";
import ApiLists from "@/components/ApiLists";
import { BillboardColumns, columns } from "./columns";

interface BCProps {
  data: BillboardColumns[];
}
const BillboardClients = ({ data }: BCProps) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data.length})`}
          description="Manage billboards for your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 size-4" />
          Add New
        </Button>
      </div>
      <Separator />

      <DataTable searchKey="label" columns={columns} data={data} />

      <Heading title="API" description="API calls for billboards" />
      <ApiLists entityName="billboards" entityId="billboardId" />
    </>
  );
};

export default BillboardClients;
