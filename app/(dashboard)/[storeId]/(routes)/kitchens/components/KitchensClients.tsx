"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/Heading";
import ApiLists from "@/components/ApiLists";
import { KitchensColumns, columns } from "./columns";

interface KCProps {
  data: KitchensColumns[];
}

const SizeClients = ({ data }: KCProps) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Kitchens (${data.length})`}
          description="Manage Kitchens for your store"
        />

        <Button onClick={() => router.push(`/${params.storeId}/kitchens/new`)}>
          <Plus className="mr-2 size-4" />
          Add New
        </Button>
      </div>

      <Separator />

      <DataTable searchKey="name" columns={columns} data={data} />

      <Heading title="API" description="API calls for Kitchens" />
      <ApiLists entityName="kitchens" entityId="kitchensId" />
    </>
  );
};

export default SizeClients;
