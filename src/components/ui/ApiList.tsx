"use client";

import { useParams } from "next/navigation";
import { useOrigin } from "@/hooks/use-origin";
import ApiAlert from "@/components/ui/ApiAlert";

interface ApiListProps {
  entityName: string;
  entityId: string;
}

const ApiList = ({ entityName, entityId }: ApiListProps) => {
  const params = useParams();
  const origin = useOrigin();

  const baseUrl = `${origin}/api/${params.storeId}`;

  return (
    <>
      <ApiAlert
        title="GET"
        description={`${baseUrl}/${entityName}`}
        variant="public"
      />

      <ApiAlert
        title="GET"
        description={`${baseUrl}/${entityName}/{${entityId}}`}
        variant="public"
      />

      <ApiAlert
        title="POST"
        description={`${baseUrl}/${entityName}`}
        variant="admin"
      />

      <ApiAlert
        title="PATCH"
        description={`${baseUrl}/${entityName}/{${entityId}}`}
        variant="admin"
      />

      <ApiAlert
        title="DELETE"
        description={`${baseUrl}/${entityName}/{${entityId}}`}
        variant="admin"
      />
    </>
  );
};

export default ApiList;
