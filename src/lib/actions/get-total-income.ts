import { db } from "@/lib/db";

export const getTotalIncome = async (storeId: string) => {
  const paidOrders = await db.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return paidOrders.reduce((acc, order) => {
    return (
      acc +
      order.items.reduce((acc, item) => {
        return acc + item.product.price.toNumber();
      }, 0)
    );
  }, 0);
};
