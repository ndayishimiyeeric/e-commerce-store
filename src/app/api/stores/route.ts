import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import {CreateStoreFormScheme} from "@/lib/validators/store-form";
import {db} from "@/lib/db";
import {z} from "zod";

export async function POST(req: Request) {
    try {
        const {userId} = auth();
        const payload =  await req.json();

        const {name} = CreateStoreFormScheme.parse(payload);

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        if (!name) {
            return new NextResponse("Invalid Request", {status: 400})
        }

        const storeExists = await db.store.findFirst({
            where: {
                name,
                userId,
            },
        })

        if (storeExists) {
            return new NextResponse("Store already exists", {status: 409})
        }

        const store = await db.store.create({
            data: {
                name,
                userId,
            }
        });

        return NextResponse.json(store)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, {status: 422})
        }
        return new NextResponse("Internal Server Error", {status: 500})
    }
}