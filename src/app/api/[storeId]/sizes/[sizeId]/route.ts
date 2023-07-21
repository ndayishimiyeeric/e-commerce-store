import {auth} from "@clerk/nextjs";
import {db} from "@/lib/db";
import {NextResponse} from "next/server";
import {z} from "zod";
import {SizeFormSchema} from "@/lib/validators/size-form";

export async function PATCH(
    req: Request,
    {params}: {params: {storeId: string; sizeId: string}}
) {
    try {
        const {userId} = auth()
        const payload = await req.json()

        const {name, value} = SizeFormSchema.parse(payload)

        if (!userId) {
            return new Response("Unauthenticated", {status: 401})
        }

        if (!name || !value) {
            return new Response("Bad Request Both name and value are required", {status: 400})
        }

        if (!params.sizeId) {
            return new Response("size id is required", {status: 400})
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

        const sizeExists = await db.size.findFirst({
            where: {
                id: params.sizeId,
                storeId: params.storeId,
            },
        })

        if (!sizeExists) {
            return new Response("Unauthorized", {status: 404})
        }

        const size = await db.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name,
                value,
            },
        })

        return NextResponse.json(size, {status: 201})
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse('Invalid data passed', {status: 422})
        }
        return new Response("Can not update size at this time", {status: 500})
    }
}


export async function DELETE(
    req: Request,
    {params}: {params: {storeId: string; sizeId: string}}
) {
    try {
        const {userId} = auth()

        if (!userId) {
            return new Response("Unauthenticated", {status: 401})
        }

        if (!params.sizeId) {
            return new Response("Bad Request size id is required", {status: 400})
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

        const sizeExists = await db.size.findFirst({
            where: {
                id: params.sizeId,
                storeId: params.storeId,
            },
        })

        if (!sizeExists) {
            return new Response("Size Not Found", {status: 404})
        }

        const size = await db.size.deleteMany({
            where: {
                id: params.sizeId,
                storeId: params.storeId,
            },
        })

        return NextResponse.json(size, {status: 201})
    } catch (error) {
        return new Response("Can not delete size at this time", {status: 500})
    }
}


export async function GET(
    req: Request,
    {params}: {params: {storeId: string; sizeId: string}}
) {
    try {
        if (!params.sizeId) {
            return new Response("Bad Request size Id is required", {status: 400})
        }

        const storeExists = await db.store.findFirst({
            where: {
                id: params.storeId,
            }
        })

        if (!storeExists) {
            return new Response("Store Not found", {status: 404})
        }

        const sizeExists = await db.size.findUnique({
            where: {
                id: params.sizeId,
            },
        })

        if (!sizeExists) {
            return new Response("Size Not found", {status: 404})
        }

        const size = await db.size.findFirst({
            where: {
                id: params.sizeId,
                storeId: params.storeId,
            },
        })

        return NextResponse.json(size, {status: 201})
    } catch (error) {
        return new Response("Can not get size at this time", {status: 500})
    }
}
