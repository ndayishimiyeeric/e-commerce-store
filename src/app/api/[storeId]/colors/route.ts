import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ColorFormSchema } from "@/lib/validators/color-form";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const payload = await req.json();

    const { name, value } = ColorFormSchema.parse(payload);

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!name || !value) {
      return new Response("Bad Request Both name and value are required", {
        status: 400,
      });
    }

    if (!params.storeId) {
      return new Response("StoreId is required", { status: 400 });
    }

    const storeExists = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeExists) {
      return new Response("Unauthorized", { status: 404 });
    }

    const color = await db.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(color, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid data passed", { status: 422 });
    }
    return new Response(
      "internal server error, can not create color at this time",
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
      return new Response("No store found", { status: 404 });
    }

    const colors = await db.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(colors, { status: 201 });
  } catch (error) {
    return new Response(
      "internal server error, can not get colors at this time",
      { status: 500 }
    );
  }
}
