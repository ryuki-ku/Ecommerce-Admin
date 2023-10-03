import prismadb from "@/lib/prismadb";

interface DashBoardPage {
    params: {storeId: string};
}

const DashboardPage: React.FC<DashBoardPage> = async ({params}) => {
    const store = await prismadb.store.findFirst({
        where: {
            userId: params.storeId
        }
    })
    // console.log(params);
    return (
        <div>
            This is a DashBoard {`${store?.name}`}
        </div>
    )
}

export default DashboardPage;