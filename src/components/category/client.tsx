"use client"

import {useParams, useRouter} from "next/navigation";
import { Plus } from "lucide-react";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import {DataTable} from "@/components/DataTable";
import {columns} from "@/components/category/columns";
import ApiList from "@/components/ui/ApiList";
import {CategoryColumn} from "@/types/category-column";

interface CategoryClientProps {
    categories: CategoryColumn[];
}

const CategoryClient = ({categories}: CategoryClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${categories.length})`}
          description="Manage categories for your store."
        />
        <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
        <Separator className="mt-2" />

      <DataTable columns={columns} data={categories} searchKey='name' searchTerm="name"/>

        <Heading
          title="API"
          description="API calls for your categories."
        />

        <Separator className="mt-2" />

        <ApiList entityName="categories" entityId="categoryId" />
    </div>
  )
}

export default CategoryClient;
