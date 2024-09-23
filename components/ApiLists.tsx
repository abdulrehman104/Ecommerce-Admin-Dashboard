"use client";

import useOrigin from "@/hooks/useOrigin";
import { useParams } from "next/navigation";
import ApiAlter from "./ApiAlter";

interface ALProps {
  entityName: string;
  entityId: string;
}

const ApiLists = ({ entityName, entityId }: ALProps) => {
  const params = useParams();
  const origin = useOrigin();

  const baseUrl = `${origin}/api/${params.storeId}`;

  return (
    <>
      <ApiAlter
        title="GET"
        desc={`${baseUrl}/${entityName}`}
        varient="public"
      />
      <ApiAlter
        title="GET"
        desc={`${baseUrl}/${entityName}/${entityId}`}
        varient="public"
      />
      <ApiAlter
        title="POST"
        desc={`${baseUrl}/${entityName}/${entityId}`}
        varient="admin"
      />
      <ApiAlter
        title="PATCH"
        desc={`${baseUrl}/${entityName}/${entityId}`}
        varient="admin"
      />
      <ApiAlter
        title="DELETE"
        desc={`${baseUrl}/${entityName}/${entityId}`}
        varient="admin"
      />
    </>
  );
};

export default ApiLists;
