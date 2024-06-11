import { format } from "date-fns";
import { db } from "@/lib/db";
import SizeClient from "@/components/size/client";
import { SizeColumn } from "@/types/size-column";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const sizes = await db.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  })) satisfies SizeColumn[];

  return (
    <div className="flex-col">
      <div className="flex-1 space-x-4 p-8 py-6">
        <SizeClient sizes={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
