import {format} from "date-fns";
import {db} from "@/lib/db";
import ProductClient from "@/components/product/client";
import {ProductColumn} from "@/types/product-column";
import {priceFormatter} from "@/lib/utils";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const ProductsPage = async ({params}:{params: {storeId: string}}) => {
    const products = await db.product.findMany({
        where: {
            storeId: params.storeId,
        },
        include: {
            category: true,
            size: true,
            color: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    const formattedProducts = products.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        category: item.category.name,
        price: priceFormatter.format(item.price.toNumber()),
        size: item.size.name,
        color: item.color.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })) satisfies ProductColumn[]

    return (
        <div className="flex-col">
            <div className="flex-1 space-x-4 p-8 py-6">
              <ProductClient products={formattedProducts} />
            </div>
        </div>
    )
};

export default ProductsPage;
