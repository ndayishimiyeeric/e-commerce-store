import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; originId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!params.originId) {
      return new Response("Bad Request origin id is required", { status: 400 });
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

    const sizeExists = await db.allowedOrigin.findFirst({
      where: {
        id: params.originId,
        storeId: params.storeId,
      },
    });

    if (!sizeExists) {
      return new Response("Origin does not exist", { status: 404 });
    }

    const origin = await db.allowedOrigin.delete({
      where: {
        id: params.originId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(origin, { status: 201 });
  } catch (error) {
    return new Response(
      "Internal server error, can not delete origin at this time",
      { status: 500 }
    );
  }
}
