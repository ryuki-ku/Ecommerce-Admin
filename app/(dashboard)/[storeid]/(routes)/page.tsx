import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getStockCount } from "@/actions/get-stock-number";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { Overview } from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { CreditCard, DollarSign, Package } from "lucide-react";

interface DashBoardPage {
    params: {storeId: string};
}

const DashboardPage: React.FC<DashBoardPage> = async ({params}) => {
    const totalRevenue = await getTotalRevenue(params.storeId);
    const salesCount = await getSalesCount(params.storeId);
    const stockCount = await getStockCount(params.storeId);
    const graphRevenue = await getGraphRevenue(params.storeId);
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading title="DashBoard" description="Overview Payment" />
                <Separator />
                <div className="grid gap-4 grid-cols-4 ">
                    {/* Display total revenue of store */}
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-4">
                            <CardTitle className="text-sm font-semibold">
                                Total Revenue
                            </CardTitle>
                        <DollarSign className="h-5 w-5 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatter.format(totalRevenue)}
                            </div>
                        </CardContent>
                    </Card>

                    {/* display the sales of products */}
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-4">
                            <CardTitle className="text-sm font-semibold">
                                Sales
                            </CardTitle>
                        <CreditCard className="h-5 w-5 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                +{salesCount}
                            </div>
                        </CardContent>
                    </Card>

                    {/* display number of products in store */}
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-4">
                            <CardTitle className="text-sm font-semibold">
                                Products In Stock
                            </CardTitle>
                        <Package className="h-5 w-5 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stockCount}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Display graph of sales each days/month */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                     </CardHeader>
                    <CardContent className="pl-2">
                         <Overview data={graphRevenue} />
                    </CardContent>
                </Card>
            </div> 
        </div>
    )
}

export default DashboardPage;