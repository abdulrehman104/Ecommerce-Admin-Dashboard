import { CreditCard, DollarSign, Package } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/Heading";
import { Overview } from "@/components/Overview";
import { formatter } from "@/lib/utils";

import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getProductCount } from "@/actions/get-product-count";
import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getOrderPaymentStatusTotalRevenue } from "@/actions/get-total-revenue-b-order";
import { getOrderTotalRevenueByCategory } from "@/actions/get-total-revunue-by-category";
import { getOrderStatusTotalRevenue } from "@/actions/get-order-status-total-revunue";

interface DProps {
  params: { storeId: string };
}

const DashBoardOverview = async ({ params }: DProps) => {
  const totalRevenue = await getTotalRevenue(params.storeId);
  const salesCount = await getSalesCount(params.storeId);
  const productCount = await getProductCount(params.storeId);
  const graphRevenue = await getGraphRevenue(params.storeId);
  const orderPaymentStatusTotalRevenue =
    await getOrderPaymentStatusTotalRevenue(params.storeId);

  const orderTotalRevenueByCategory = await getOrderTotalRevenueByCategory(
    params.storeId,
  );
  const orderStatusTotalRevenue = await getOrderStatusTotalRevenue(
    params.storeId,
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title="Dashboard"
          description="Manage Kitchens for your store"
        />

        <Separator />

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {formatter.format(totalRevenue)}
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Saless</CardTitle>
              <CreditCard className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              +{salesCount}
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Products in stock
              </CardTitle>
              <Package className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              +{productCount}
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Revenue By Month
              </CardTitle>
              <Package className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              <Overview data={graphRevenue} />
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Revenue By Payment Status
              </CardTitle>
              <Package className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              <Overview data={orderPaymentStatusTotalRevenue} />
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Revenue By Category
              </CardTitle>
              <Package className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              <Overview data={orderTotalRevenueByCategory} />
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Revenue By Order Status
              </CardTitle>
              <Package className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              <Overview data={orderStatusTotalRevenue} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashBoardOverview;
