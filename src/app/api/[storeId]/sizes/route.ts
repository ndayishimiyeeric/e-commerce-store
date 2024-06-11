import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { SizeFormSchema } from "@/lib/validators/size-form";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const payload = await req.json();

    const { name, value } = SizeFormSchema.parse(payload);

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!name || !value) {
      return new Response("Bad Request Both name and value are required", {
        status: 400,
      });
    }

    if (!params.storeId) {
      return new Response("Store Id is required", { status: 400 });
    }

    const storeExists = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeExists) {
      return new Response("Store does not exist", { status: 404 });
    }

    const size = await db.size.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(size, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid data passed", { status: 422 });
    }
    return new Response(
      "Internal server error, can not create size at this time",
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new Response("Bad Request storeId is required", { status: 400 });
    }

    const storeExists = await db.store.findFirst({
      where: {
        id: params.storeId,
      },
    });

    if (!storeExists) {
      return new Response("Store does not exist", { status: 404 });
    }

    const sizes = await db.size.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(sizes, { status: 201 });
  } catch (error) {
    return new Response(
      "Internal server error, can not get sizes at this time",
      { status: 500 }
    );
  }
}
