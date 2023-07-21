import {auth} from "@clerk/nextjs";
import {db} from "@/lib/db";
import {NextResponse} from "next/server";
import {z} from "zod";
import {CategoryFormSchema} from "@/lib/validators/category-form";

export async function POST(
    req: Request,
    {params}: {params: {storeId: string}}
) {
    try {
        const {userId} = auth()
        const payload = await req.json()

        const {name, billboardId} = CategoryFormSchema.parse(payload)

        if (!userId) {
            return new Response("Unauthenticated", {status: 401})
        }

        if (!name || !billboardId) {
            return new Response("Bad Request Both label and image are required", {status: 400})
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

        const category = await db.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId,
            }
        })

        return NextResponse.json(category, {status: 201})
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid data passed', {status: 422})
        }
        return new Response("Can not create category at this time", {status: 500})
    }
}


export async function GET(
    req: Request,
    {params}: {params: {storeId: string}}
) {
    try {

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

        const categories = await db.category.findMany({
            where: {
                storeId: params.storeId,
            }
        })

        return NextResponse.json(categories, {status: 201})
    } catch (error) {
        return new Response("Can not get Categories at this time", {status: 500})
    }
}
