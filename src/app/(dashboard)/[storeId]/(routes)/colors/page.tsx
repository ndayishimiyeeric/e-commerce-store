import {format} from "date-fns";
import {db} from "@/lib/db";
import ColorClient from "@/components/color/client";
import {ColorColumn} from "@/types/color-column";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const ColorsPage = async ({params}:{params: {storeId: string}}) => {
    const colors = await db.color.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    const formattedColors = colors.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })) satisfies ColorColumn[]

    return (
        <div className="flex-col">
            <div className="flex-1 space-x-4 p-8 py-6">
              <ColorClient colors={formattedColors} />
            </div>
        </div>
    )
};

export default ColorsPage;
