import {format} from "date-fns";
import {db} from "@/lib/db";
import OrderClient from "@/components/order/client";
import {OrderColumn} from "@/types/order-column";
import {priceFormatter} from "@/lib/utils";

const OrdersPage = async ({params}:{params: {storeId: string}}) => {
    const orders = await db.order.findMany({
        where: {
            storeId: params.storeId,
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    const formattedOrders = orders.map((item) => ({
        id: item.id,
        phone: item.phone,
        address: item.address,
        products: item.items.map((orderItem) => orderItem.product.name).join(", "),
        totalPrice: priceFormatter.format(item.items.reduce((acc, orderItem) => acc + Number(orderItem.product.price), 0)),
        isPaid: item.isPaid,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })) satisfies OrderColumn[]

    return (
        <div className="flex-col">
            <div className="flex-1 space-x-4 p-8 py-6">
              <OrderClient orders={formattedOrders} />
            </div>
        </div>
    )
};

export default OrdersPage;
