"use client"

import {useParams, useRouter} from "next/navigation";
import { Plus } from "lucide-react";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import {BillboardColumn} from "@/types/billboard-column";
import {DataTable} from "@/components/DataTable";
import {columns} from "@/components/billboard/columns";
import ApiList from "@/components/ui/ApiList";

interface BillboardClientProps {
    billboards: BillboardColumn[];
}

const BillboardClient = ({billboards}: BillboardClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${billboards.length})`}
          description="Manage billboards for your store."
        />
        <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
        <Separator className="mt-2" />

      <DataTable columns={columns} data={billboards} searchKey='label' searchTerm="label"/>

        <Heading
          title="API"
          description="API calls for your billboards."
        />

        <Separator className="mt-2" />

        <ApiList entityName="billboards" entityId="billboardId" />
    </div>
  )
}

export default BillboardClient;
