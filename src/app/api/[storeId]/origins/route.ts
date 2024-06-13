import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { AllowedOriginSchema } from "@/lib/validators/allowed-origin";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const payload = await req.json();

    const { origin } = AllowedOriginSchema.parse(payload);

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!origin) {
      return new Response("Bad Request origin is required", {
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

    const data = await db.allowedOrigin.create({
      data: {
        origin,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid data passed", { status: 422 });
    }
    return new Response(
      "Internal server error, can not add origin at this time",
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

    const origins = await db.allowedOrigin.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(origins, { status: 201 });
  } catch (error) {
    return new Response(
      "Internal server error, can not get origins at this time",
      { status: 500 }
    );
  }
}
