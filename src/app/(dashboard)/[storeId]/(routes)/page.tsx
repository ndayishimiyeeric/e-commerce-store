import React from "react";
import Heading from "@/components/ui/Heading";
import { Separator } from "@/components/ui/Separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CreditCard, DollarSign, Package } from "lucide-react";
import { priceFormatter } from "@/lib/utils";
import { getTotalIncome } from "@/lib/actions/get-total-income";
import { getSalesCount } from "@/lib/actions/get-sales-count";
import { getStockCount } from "@/lib/actions/get-stock-count";
import Overview from "@/components/Overview";
import { getGraphData } from "@/lib/actions/get-graph-data";

interface DashboardPageProps {
  params: { storeId: string };
}
const DashboardPage = async ({ params }: DashboardPageProps) => {
  const totalIncome = await getTotalIncome(params.storeId);
  const sales = await getSalesCount(params.storeId);
  const stock = await getStockCount(params.storeId);
  const graphData = await getGraphData(params.storeId);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store" />

        <Separator />

        <div className="grid gap-4 grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Income
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {priceFormatter.format(totalIncome)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{sales}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stock}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="col-span-4">
            <CardTitle className="text-sm font-medium">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview data={graphData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
