import {db} from "@/lib/db";
import ColorForm from "@/components/color/color-form";

const SizePage = async (
    {params}: {params: {storeId: string, colorId: string}}
) => {
    const color = await db.color.findUnique({
        where: {
            id: params.colorId,
        },
    })
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorForm color={color} />
            </div>
        </div>
    )
};

export default SizePage;