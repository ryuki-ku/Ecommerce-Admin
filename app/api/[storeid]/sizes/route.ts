import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";


export async function POST (
    req: Request,
    {params} : {params : { storeid: string}}
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, value } = body;

        if(!userId) {
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if(!name) {
            return new Response("Name is required", {status: 400})
        }

        if(!value) {
            return new Response("Value is required", {status: 400})
        }

        if(!params.storeid) {
            return new Response("Store id is required", {status: 400})
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

        const size = await prismadb.size.create({
            data: {
                name,
                value,
                storeId: params.storeid
            }
        });

        return NextResponse.json(size);
    } catch (error) {
        console.log("[SIZE_POST]", error);
        return new NextResponse("Internal Error", {status: 500})
    }
}


export async function GET (
    req: Request,
    {params} : {params : { storeid: string}}
) {
    try {

        if(!params.storeid) {
            return new Response("Store id is required", {status: 400})
        }

        const size = await prismadb.size.findMany({
            where: {
                storeId: params.storeid,
            },
        });

        return NextResponse.json(size);
    } catch (error) {
        console.log("[SIZE_GET]", error);
        return new NextResponse("Internal Error", {status: 500})
    }
}