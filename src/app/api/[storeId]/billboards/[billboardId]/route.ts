import {auth} from "@clerk/nextjs";
import {BillboardFormSchema} from "@/lib/validators/billboard-form";
import {db} from "@/lib/db";
import {NextResponse} from "next/server";
import {z} from "zod";

export async function PATCH(
    req: Request,
    {params}: {params: {storeId: string; billboardId: string}}
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

        if (!params.billboardId) {
            return new Response("Bad Request billboard id is required", {status: 400})
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

        const billboardExists = await db.billboard.findFirst({
            where: {
                id: params.billboardId,
                storeId: params.storeId,
            },
        })

        if (!billboardExists) {
            return new Response("No billboard found", {status: 404})
        }

        const billboard = await db.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl,
            },
        })

        return NextResponse.json(billboard, {status: 201})
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid data passed', {status: 422})
        }
        return new Response("Internal server error, can not create billboard at this time", {status: 500})
    }
}


export async function DELETE(
    req: Request,
    {params}: {params: {storeId: string; billboardId: string}}
) {
    try {
        const {userId} = auth()

        if (!userId) {
            return new Response("Unauthenticated", {status: 401})
        }

        if (!params.billboardId) {
            return new Response("Bad Request billboard Id is required", {status: 400})
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

        const billboardExists = await db.billboard.findFirst({
            where: {
                id: params.billboardId,
                storeId: params.storeId,
            },
        })

        if (!billboardExists) {
            return new Response("No Billboard found", {status: 404})
        }

        const billboard = await db.billboard.deleteMany({
            where: {
                id: params.billboardId,
                storeId: params.storeId,
            },
        })

        return NextResponse.json(billboard, {status: 201})
    } catch (error) {
        return new Response("Internal server error, can not create billboard at this time", {status: 500})
    }
}


export async function GET(
    req: Request,
    {params}: {params: {storeId: string; billboardId: string}}
) {
    try {
        if (!params.billboardId) {
            return new Response("Bad Request Billboard is required", {status: 400})
        }

        const storeExists = await db.store.findFirst({
            where: {
                id: params.storeId,
            }
        })

        if (!storeExists) {
            return new Response("Store Not found", {status: 404})
        }

        const billboard = await db.billboard.findFirst({
            where: {
                id: params.billboardId,
                storeId: params.storeId,
            },
        })

        return NextResponse.json(billboard, {status: 201})
    } catch (error) {
        return new Response("Internal server error, can not get billboard at this time", {status: 500})
    }
}
