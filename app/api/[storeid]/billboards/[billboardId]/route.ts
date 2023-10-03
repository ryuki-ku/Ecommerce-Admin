import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: {params: { billboardId: string}}
) {
    try {

        if(!params.billboardId) {
            return new NextResponse("Billboard id is required", {status: 400})
        }

        const billboard = await prismadb.billBoard.findUnique({
            where: {
                id: params.billboardId,
            }
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.log("[BILLBOARD_GET]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}

export async function PATCH (
    req: Request,
    { params }: {params: { billboardId: string, storeid: string}}
) {
    try {
        const {userId} = auth();
        const body = await req.json();

        const {label, imageUrl} = body;

        if(!userId) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!label) {
            return new NextResponse("label is required", {status: 400})
        }

        if(!imageUrl) {
            return new NextResponse("imageUrl is required", {status: 400})
        }

        if(!params.billboardId) {
            return new NextResponse("Billboard id is required", {status: 400})
        }

        //Check if any user doing something in another user's store
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeid,
                userId
            }
        });

        if(!storeByUserId) {
            return new Response("Unauthorized", {status: 403});
        }

        const billboard = await prismadb.billBoard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        });
        
        return NextResponse.json(billboard);

    } catch (error) {
        console.log("[BILLBOARD_PATCH]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}

export async function DELETE (
    req: Request,
    { params }: {params: { billboardId: string, storeid: string}}
) {
    try {
        const {userId} = auth();

        if(!userId) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!params.billboardId) {
            return new NextResponse("Billboard id is required", {status: 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeid,
                userId
            }
        });

        if(!storeByUserId) {
            return new Response("Unauthorized", {status: 403});
        }

        const billboard = await prismadb.billBoard.deleteMany({
            where: {
                id: params.billboardId,
            }
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.log("[BILLBOARD_DELETE]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}