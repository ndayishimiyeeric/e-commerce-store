import { db } from "@/lib/db";

export const getStockCount = async (storeId: string) => {
  const products = await db.product.findMany({
    where: {
      storeId,
      isArchived: false,
    },
  });

  return products.reduce((acc, product) => {
    return acc + product.quantity;
  }, 0);
};
