import {db} from "@/lib/db";

export const getSalesCount = async (storeId: string) => {
    const sales = await db.order.count({
        where: {
            storeId,
            isPaid: true
        },
    })

    return sales
}
