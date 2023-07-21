"use client"

import {useParams, useRouter} from "next/navigation";
import { Plus } from "lucide-react";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import {BillboardColumn} from "@/types/billboard-column";
import {DataTable} from "@/components/DataTable";
import {columns} from "@/components/billboard/columns";

interface BillboardClientProps {
    billboards: BillboardColumn[];
}

const BillboardClient = ({billboards}: BillboardClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
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
      <Separator />

      <DataTable columns={columns} data={billboards} searchKey='label' searchTerm="label"/>
    </>
  )
}

export default BillboardClient;
