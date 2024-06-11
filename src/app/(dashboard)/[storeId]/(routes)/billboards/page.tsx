import { format } from "date-fns";
import { db } from "@/lib/db";
import BillboardClient from "@/components/billboard/client";
import { BillboardColumn } from "@/types/billboard-column";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards = billboards.map((billboard) => ({
    id: billboard.id,
    label: billboard.label,
    createdAt: format(billboard.createdAt, "MMMM do, yyyy"),
  })) satisfies BillboardColumn[];

  return (
    <div className="flex-col">
      <div className="flex-1 space-x-4 p-8 py-6">
        <BillboardClient billboards={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
