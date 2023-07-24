"use client"

import {useParams, useRouter} from "next/navigation";
import { Plus } from "lucide-react";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import {ColorColumn} from "@/types/color-column";
import {DataTable} from "@/components/DataTable";
import {columns} from "@/components/color/columns";
import ApiList from "@/components/ui/ApiList";

interface ColorClientProps {
    colors: ColorColumn[];
}

const ColorClient = ({colors}: ColorClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors (${colors.length})`}
          description="Manage Colors for your store."
        />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
        <Separator className="mt-2" />

      <DataTable columns={columns} data={colors} searchKey='name' searchTerm="name"/>

        <Heading
          title="API"
          description="API calls for your colors."
        />

        <Separator className="mt-2" />

        <ApiList entityName="colors" entityId="colorId" />
    </div>
  )
}

export default ColorClient;
