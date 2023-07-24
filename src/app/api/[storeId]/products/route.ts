import {auth} from "@clerk/nextjs";
import {db} from "@/lib/db";
import {NextResponse} from "next/server";
import {z} from "zod";
import {ProductFormSchema} from "@/lib/validators/product-form";

export async function POST(
    req: Request,
    {params}: {params: {storeId: string}}
) {
    try {
        const {userId} = auth()
        const payload = await req.json()

        const {
            name,
            price,
            quantity,
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived,
        } = ProductFormSchema.parse(payload)

        if (!userId) {
            return new Response("Unauthenticated", {status: 401})
        }

        if (!name) {
            return new Response("Name is required", {status: 400})
        }

        if (!price) {
            return new Response("price is required", {status: 400})
        }

        if (!quantity) {
            return new Response("Quantity is required", {status: 400})
        }

        if (!categoryId) {
            return new Response("Category id is required", {status: 400})
        }

        if (!sizeId) {
            return new Response("Size id is required", {status: 400})
        }

        if (!colorId) {
            return new Response("Color id is required", {status: 400})
        }

        if (!images || !images.length) {
            return new Response("Images are required", {status: 400})
        }

        if (!params.storeId) {
            return new Response("StoreId is required", {status: 400})
        }

        const storeExists = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        })

        if (!storeExists) {
            return new Response("Unauthorized", {status: 404})
        }

        const product = await db.product.create({
            data: {
                name,
                price,
                quantity,
                categoryId,
                colorId,
                sizeId,
                isArchived,
                isFeatured,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string }) => image)
                        ]
                    }
                },
                storeId: params.storeId,
            }
        })

        return NextResponse.json(product, {status: 201})
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid data passed', {status: 422})
        }
        return new Response("internal server error, can not create product at this time", {status: 500})
    }
}


export async function GET(
    req: Request,
    {params}: {params: {storeId: string}}
) {
    try {
        const {searchParams} = new URL(req.url)
        const categoryId = searchParams.get('categoryId') || undefined
        const colorId = searchParams.get('colorId') || undefined
        const sizeId = searchParams.get('sizeId') || undefined
        const isFeatured = searchParams.get('isFeatured')

        if (!params.storeId) {
            return new Response("Bad Request storeId is required", {status: 400})
        }

        const storeExists = await db.store.findFirst({
            where: {
                id: params.storeId,
            }
        })

        if (!storeExists) {
            return new Response("No store found", {status: 404})
        }

        const products = await db.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true,
            },
            orderBy: {
                createdAt: 'desc'
            },
        })

        return NextResponse.json(products, {status: 201})
    } catch (error) {
        return new Response("internal server error, can not get products at this time", {status: 500})
    }
}
