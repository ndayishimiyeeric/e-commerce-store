"use client"

import Heading from "@/components/ui/Heading";
import { Separator } from "@/components/ui/Separator";
import {OrderColumn} from "@/types/order-column";
import {DataTable} from "@/components/DataTable";
import {columns} from "@/components/order/columns";

interface OrderClientProps {
    orders: OrderColumn[];
}

const OrderClient = ({orders}: OrderClientProps) => {

  return (
    <div>
      <Heading
        title={`Orders (${orders.length})`}
        description="Manage Orders for your store."
      />
      <Separator className="mt-2" />

      <DataTable columns={columns} data={orders} searchKey='products' searchTerm="products"/>
    </div>
  )
}

export default OrderClient;
