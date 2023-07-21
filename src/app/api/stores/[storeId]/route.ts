import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import {CreateStoreFormScheme} from "@/lib/validators/store-form";
import {db} from "@/lib/db";
import {z} from "zod";

export async function PATCH(
    req: Request,
    {params}: {params: {storeId: string}}
) {
    try {
        const {userId} = auth();

        const payload = await req.json();
        const {name} = CreateStoreFormScheme.parse(payload);

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if (!name) {
            return new NextResponse("Bad Request Name is required", {status: 400});
        }

        if (!params.storeId) {
            return new NextResponse("Bad Request Store ID is required", {status: 400});
        }

        const storeExists = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            },
        })

        if (!storeExists) {
            return new NextResponse("Store Not Found", {status: 404});
        }

        const store = await db.store.updateMany({
            where: {
                id: params.storeId,
                userId,
            },
            data: {
                name,
            },
        })

        return NextResponse.json(store)

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, {status: 422})
        }
        return new NextResponse("Internal Server Error, can not update store at this time try again later", {status: 500});
    }
}

export async function DELETE(
    req: Request,
    {params}: {params: {storeId: string}}
) {
    try {
        const {userId} = auth();

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if (!params.storeId) {
            return new NextResponse("Bad Request Store ID is required", {status: 400});
        }

        const storeExists = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            },
        })

        if (!storeExists) {
            return new NextResponse("Store Not Found", {status: 404});
        }

        const store = await db.store.deleteMany({
            where: {
                id: params.storeId,
                userId,
            },
        })

        return NextResponse.json(store)

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, {status: 422})
        }
        return new NextResponse("Internal Server Error, can not delete store at this time try again later", {status: 500});
    }
}
