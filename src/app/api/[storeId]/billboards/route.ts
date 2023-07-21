import {auth} from "@clerk/nextjs";
import {BillboardFormSchema} from "@/lib/validators/billboard-form";
import {db} from "@/lib/db";
import {NextResponse} from "next/server";
import {z} from "zod";

export async function POST(
    req: Request,
    {params}: {params: {storeId: string}}
) {
    try {
        const {userId} = auth()
        const payload = await req.json()

        const {label, imageUrl} = BillboardFormSchema.parse(payload)

        if (!userId) {
            return new Response("Unauthenticated", {status: 401})
        }

        if (!label || !imageUrl) {
            return new Response("Bad Request Both label and image are required", {status: 400})
        }

        if (!params.storeId) {
            return new Response("Bad Request storeId is required", {status: 400})
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

        const billboard = await db.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId,
            }
        })

        return NextResponse.json(billboard, {status: 201})
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid data passed', {status: 422})
        }
        return new Response("Can not create billboard at this time", {status: 500})
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

        const billboards = await db.billboard.findMany({
            where: {
                storeId: params.storeId,
            }
        })

        return NextResponse.json(billboards, {status: 201})
    } catch (error) {
        return new Response("Can not get billboards at this time", {status: 500})
    }
}
