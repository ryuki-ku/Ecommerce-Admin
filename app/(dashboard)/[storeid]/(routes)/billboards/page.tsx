import prismadb from "@/lib/prismadb";
import { format } from "date-fns"

import { BillboardClient } from "./components/client";
import { billboardColumn } from "./components/columns";

const BillboardsPage = async ({
    params
}: {
    params: {storeid: string}
}) => {
    const billboards = await prismadb.billBoard.findMany({
        where: {
            storeId: params.storeid
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedBillboards: billboardColumn[] = billboards.map((item) => ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "MMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient data={formattedBillboards}/>
            </div>
        </div>
    )
}

export default BillboardsPage;