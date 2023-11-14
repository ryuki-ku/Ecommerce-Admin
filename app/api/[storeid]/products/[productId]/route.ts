import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: {params: { productId: string}}
) {
    try {

        if(!params.productId) {
            return new NextResponse("Product id is required", {status: 400})
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.log("[PRODUCTS_GET]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}

export async function PATCH (
    req: Request,
    { params }: {params: { productId: string, storeid: string}}
) {
    try {
        const {userId} = auth();
        const body = await req.json();

        const { 
            name,
            images,
            price,
            categoryId,
            colorId,
            sizeId,
            description,
            starRating,
            isFeatured,
            isArchived,
         } = body;

        if(!userId) {
            return new NextResponse("Unauthenticated", {status: 401})
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

        if(!params.productId) {
            return new NextResponse("Product id is required", {status: 400})
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

        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    deleteMany: {}
                },
                description,
                starRating,
                isFeatured,
                isArchived
            }
        });

        const product = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image)
                        ]
                    }
                }
            }
        })
        
        return NextResponse.json(product);

    } catch (error) {
        console.log("[PRODUCT_PATCH]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}

export async function DELETE (
    req: Request,
    { params }: {params: { productId: string, storeid: string}}
) {
    try {
        const {userId} = auth();

        if(!userId) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!params.productId) {
            return new NextResponse("Product id is required", {status: 400})
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

        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.log("[PRODUCT_DELETE]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}