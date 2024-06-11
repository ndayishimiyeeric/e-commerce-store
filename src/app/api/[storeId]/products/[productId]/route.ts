import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ProductFormSchema } from "@/lib/validators/product-form";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();
    const payload = await req.json();

    const {
      name,
      price,
      quantity,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = ProductFormSchema.parse(payload);

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new Response("Name is required", { status: 400 });
    }

    if (!price) {
      return new Response("price is required", { status: 400 });
    }

    if (!quantity) {
      return new Response("Quantity is required", { status: 400 });
    }

    if (!categoryId) {
      return new Response("Category id is required", { status: 400 });
    }

    if (!sizeId) {
      return new Response("Size id is required", { status: 400 });
    }

    if (!colorId) {
      return new Response("Color id is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new Response("Images are required", { status: 400 });
    }

    if (!params.productId) {
      return new Response("Product id is required", { status: 400 });
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

    const productExists = await db.product.findFirst({
      where: {
        id: params.productId,
        storeId: params.storeId,
      },
    });

    if (!productExists) {
      return new Response("Product does not exist", { status: 404 });
    }

    await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        quantity,
        images: {
          deleteMany: {},
        },
      },
    });

    const product = await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid data passed", { status: 422 });
    }
    return new Response(
      "Internal server error, can not update product at this time",
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!params.productId) {
      return new Response("Product id is required", { status: 400 });
    }

    const storeExists = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeExists) {
      return new Response("No store found", { status: 404 });
    }

    const productExists = await db.product.findFirst({
      where: {
        id: params.productId,
        storeId: params.storeId,
      },
    });

    if (!productExists) {
      return new Response("Color Not Found", { status: 404 });
    }

    const product = await db.product.deleteMany({
      where: {
        id: params.productId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return new Response(
      "Internal server error, can not delete product at this time",
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    if (!params.productId) {
      return new Response("Product Id is required", { status: 400 });
    }

    const storeExists = await db.store.findFirst({
      where: {
        id: params.storeId,
      },
    });

    if (!storeExists) {
      return new Response("Store Not found", { status: 404 });
    }

    const product = await db.product.findFirst({
      where: {
        id: params.productId,
        storeId: params.storeId,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return new Response(
      "Internal server error, can not get product at this time",
      { status: 500 }
    );
  }
}
