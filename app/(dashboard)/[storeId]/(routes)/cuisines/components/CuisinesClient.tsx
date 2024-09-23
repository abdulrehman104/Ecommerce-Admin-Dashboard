"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { CuisinesColumns, columns } from "./columns";
import Heading from "@/components/Heading";
import ApiLists from "@/components/ApiLists";

interface KCProps {
  data: CuisinesColumns[];
}

const CuisinesClient = ({ data }: KCProps) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Cuisines (${data.length})`}
          description="Manage Cuisines for your store"
        />

        <Button onClick={() => router.push(`/${params.storeId}/cuisines/new`)}>
          <Plus className="mr-2 size-4" />
          Add New
        </Button>
      </div>

      <Separator />

      <DataTable searchKey="name" columns={columns} data={data} />

      <Heading title="API" description="API calls for Cusinies" />
      <ApiLists entityName="cuisines" entityId="cuisinesId" />
    </>
  );
};

export default CuisinesClient;
