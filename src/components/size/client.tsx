"use client"

import {useParams, useRouter} from "next/navigation";
import { Plus } from "lucide-react";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import {SizeColumn} from "@/types/size-column";
import {DataTable} from "@/components/DataTable";
import {columns} from "@/components/size/columns";
import ApiList from "@/components/ui/ApiList";

interface SizeClientProps {
    sizes: SizeColumn[];
}

const SizeClient = ({sizes}: SizeClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${sizes.length})`}
          description="Manage Sizes for your store."
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
        <Separator className="mt-2" />

      <DataTable columns={columns} data={sizes} searchKey='name' searchTerm="name"/>

        <Heading
          title="API"
          description="API calls for your sizes."
        />

        <Separator className="mt-2" />

        <ApiList entityName="sizes" entityId="sizeId" />
    </div>
  )
}

export default SizeClient;
