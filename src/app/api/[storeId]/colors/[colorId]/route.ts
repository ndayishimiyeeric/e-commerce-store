import {auth} from "@clerk/nextjs";
import {db} from "@/lib/db";
import {NextResponse} from "next/server";
import {z} from "zod";
import {ColorFormSchema} from "@/lib/validators/color-form";

export async function PATCH(
    req: Request,
    {params}: {params: {storeId: string; colorId: string}}
) {
    try {
        const {userId} = auth()
        const payload = await req.json()

        const {name, value} = ColorFormSchema.parse(payload)

        if (!userId) {
            return new Response("Unauthenticated", {status: 401})
        }

        if (!name || !value) {
            return new Response("Bad Request Both name and value are required", {status: 400})
        }

        if (!params.colorId) {
            return new Response("color id is required", {status: 400})
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

        const colorExists = await db.color.findFirst({
            where: {
                id: params.colorId,
                storeId: params.storeId,
            },
        })

        if (!colorExists) {
            return new Response("Unauthorized", {status: 404})
        }

        const color = await db.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value,
            },
        })

        return NextResponse.json(color, {status: 201})
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid data passed', {status: 422})
        }
        return new Response("Can not update color at this time", {status: 500})
    }
}


export async function DELETE(
    req: Request,
    {params}: {params: {storeId: string; colorId: string}}
) {
    try {
        const {userId} = auth()

        if (!userId) {
            return new Response("Unauthenticated", {status: 401})
        }

        if (!params.colorId) {
            return new Response("Bad Request color id is required", {status: 400})
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

        const colorExists = await db.color.findFirst({
            where: {
                id: params.colorId,
                storeId: params.storeId,
            },
        })

        if (!colorExists) {
            return new Response("Color Not Found", {status: 404})
        }

        const color = await db.color.deleteMany({
            where: {
                id: params.colorId,
                storeId: params.storeId,
            },
        })

        return NextResponse.json(color, {status: 201})
    } catch (error) {
        return new Response("Can not delete color at this time", {status: 500})
    }
}


export async function GET(
    req: Request,
    {params}: {params: {storeId: string; colorId: string}}
) {
    try {
        if (!params.colorId) {
            return new Response("Bad Request color Id is required", {status: 400})
        }

        const storeExists = await db.store.findFirst({
            where: {
                id: params.storeId,
            }
        })

        if (!storeExists) {
            return new Response("Store Not found", {status: 404})
        }

        const color = await db.color.findFirst({
            where: {
                id: params.colorId,
                storeId: params.storeId,
            },
        })

        return NextResponse.json(color, {status: 201})
    } catch (error) {
        return new Response("Can not get color at this time", {status: 500})
    }
}
