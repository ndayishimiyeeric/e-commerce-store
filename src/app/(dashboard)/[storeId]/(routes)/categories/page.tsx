import {format} from "date-fns";
import {db} from "@/lib/db";
import {CategoryColumn} from "@/types/category-column";
import CategoryClient from "@/components/category/client";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const CategoriesPage = async ({params}:{params: {storeId: string}}) => {
    const categories = await db.category.findMany({
        where: {
            storeId: params.storeId,
        },
        include: {
            billboard: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    const formattedCategories = categories.map((item) => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })) satisfies CategoryColumn[]

    return (
        <div className="flex-col">
            <div className="flex-1 space-x-4 p-8 py-6">
              <CategoryClient categories={formattedCategories}/>
            </div>
        </div>
    )
};

export default CategoriesPage;
