import {auth} from "@clerk/nextjs";
import {db} from "@/lib/db";
import {NextResponse} from "next/server";
import {z} from "zod";
import {CategoryFormSchema} from "@/lib/validators/category-form";

export async function PATCH(
    req: Request,
    {params}: {params: {storeId: string; categoryId: string}}
) {
    try {
        const {userId} = auth()
        const payload = await req.json()

        const {name, billboardId} = CategoryFormSchema.parse(payload)

        if (!userId) {
            return new Response("Unauthenticated", {status: 401})
        }

        if (!name || !billboardId) {
            return new Response("Bad Request Both name and billboard id are required", {status: 400})
        }

        if (!params.categoryId) {
            return new Response("category Id is required", {status: 400})
        }

        const storeExists = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        })

        if (!storeExists) {
            return new Response("No store found", {status: 404})
        }

        const categoryExists = await db.category.findFirst({
            where: {
                id: params.categoryId,
                storeId: params.storeId,
            },
        })

        if (!categoryExists) {
            return new Response("No category found", {status: 404})
        }

        const category = await db.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId,
            },
        })

        return NextResponse.json(category, {status: 201})
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid data passed', {status: 422})
        }
        return new Response("Internal server error, can not update category at this time", {status: 500})
    }
}


export async function DELETE(
    req: Request,
    {params}: {params: {storeId: string; categoryId: string}}
) {
    try {
        const {userId} = auth()

        if (!userId) {
            return new Response("Unauthenticated", {status: 401})
        }

        if (!params.categoryId) {
            return new Response("Bad Request category id is required", {status: 400})
        }

        const storeExists = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        })

        if (!storeExists) {
            return new Response("No store found", {status: 404})
        }

        const categoryExists = await db.category.findFirst({
            where: {
                id: params.categoryId,
                storeId: params.storeId,
            },
        })

        if (!categoryExists) {
            return new Response("No category found", {status: 404})
        }

        const category = await db.category.deleteMany({
            where: {
                id: params.categoryId,
                storeId: params.storeId,
            },
        })

        return NextResponse.json(category, {status: 201})
    } catch (error) {
        return new Response("Internal server error, can not delete category at this time", {status: 500})
    }
}


export async function GET(
    req: Request,
    {params}: {params: {storeId: string; categoryId: string}}
) {
    try {
        if (!params.categoryId) {
            return new Response("Bad Request category Id is required", {status: 400})
        }

        const storeExists = await db.store.findFirst({
            where: {
                id: params.storeId,
            }
        })

        if (!storeExists) {
            return new Response("Store Not found", {status: 404})
        }

        const category = await db.category.findFirst({
            where: {
                id: params.categoryId,
                storeId: params.storeId,
            },
        })

        return NextResponse.json(category, {status: 201})
    } catch (error) {
        return new Response("Internal server error, can not get category at this time", {status: 500})
    }
}
