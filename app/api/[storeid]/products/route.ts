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

        const { 
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            description,
            starRating,
            isFeatured,
            isArchived,
         } = body;

        if(!userId) {
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if(!name) {
            return new Response("Name is required", {status: 400})
        }

        if(!description) {
            return new Response("Description is required", {status: 400})
        }

        if(!starRating) {
            return new Response("Rating is required", {status: 400})
        }

        if(!images || !images.length) {
            return new Response("Image is required", {status: 400})
        }

        if(!price) {
            return new Response("Price Url is required", {status: 400})
        }


        if(!categoryId) {
            return new Response("Category Id is required", {status: 400})
        }

        if(!sizeId) {
            return new Response("Size is required", {status: 400})
        }

        if(!colorId) {
            return new Response("Color is required", {status: 400})
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

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                description,
                starRating,
                isFeatured,
                isArchived,
                storeId: params.storeid,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image)
                        ]
                    }
                }
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCTS_POST]", error);
        return new NextResponse("Internal Error in Post", {status: 500})
    }
}


export async function GET (
    req: Request,
    {params} : {params : { storeid: string}}
) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured");

        if(!params.storeid) {
            return new Response("Store id is required", {status: 400})
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeid,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.log("[PRODUCTS_GET]", error);
        return new NextResponse("Internal Error", {status: 500})
    }
}