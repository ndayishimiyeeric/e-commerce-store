"use client"

import {useParams, useRouter} from "next/navigation";
import { Plus } from "lucide-react";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import {ProductColumn} from "@/types/product-column";
import {DataTable} from "@/components/DataTable";
import {columns} from "@/components/product/columns";
import ApiList from "@/components/ui/ApiList";

interface ProductClientProps {
    products: ProductColumn[];
}

const ProductClient = ({products}: ProductClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${products.length})`}
          description="Manage products for your store."
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
        <Separator className="mt-2" />

      <DataTable columns={columns} data={products} searchKey='name' searchTerm="name"/>

        <Heading
          title="API"
          description="API calls for your products."
        />

        <Separator className="mt-2" />

        <ApiList entityName="products" entityId="productId" />
    </div>
  )
}

export default ProductClient;
