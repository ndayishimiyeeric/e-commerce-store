import {db} from "@/lib/db";
import ProductForm from "@/components/product/product-form";

const ProductPage = async (
    {params}: {params: {storeId: string, productId: string}}
) => {
    const product = await db.product.findUnique({
        where: {
            id: params.productId,
        },
        include: {
            images: true
        }
    })

    const categories = await db.category.findMany({
        where: {
            storeId: params.storeId
        }
    })

    const sizes = await db.size.findMany({
        where: {
            storeId: params.storeId
        }
    })

    const colors = await db.color.findMany({
        where: {
            storeId: params.storeId
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm
                    product={product}
                    categories={categories}
                    sizes={sizes}
                    colors={colors}
                />
            </div>
        </div>
    )
};

export default ProductPage;