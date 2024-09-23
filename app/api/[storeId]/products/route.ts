import prisma from "@/lib/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      price,
      images,
      isFeatured,
      isArchived,
      categoryId,
      sizeId,
      kitchenId,
      cuisinesId,
    } = body;

    if (!userId) {
      return new NextResponse("Un-Authenticated", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Product name is missing", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Product price is missing", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Product mages is missing", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category is missing", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size is missing", { status: 400 });
    }

    if (!kitchenId) {
      return new NextResponse("Kitchen is missing", { status: 400 });
    }

    if (!cuisinesId) {
      return new NextResponse("Cuisines is missing", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store is missing", { status: 400 });
    }

    const storeByUser = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUser) {
      return new NextResponse("Un-Authorized", { status: 403 });
    }

    const products = await prisma.product.create({
      data: {
        name,
        price,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        isFeatured,
        isArchived,
        categoryId,
        sizeId,
        kitchenId,
        cuisinesId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error(`PRODUCTS_POST: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const kitchenId = searchParams.get("kitchenId") || undefined;
    const cuisinesId = searchParams.get("cuisinesId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("StoreId is Required", { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        sizeId,
        kitchenId,
        cuisinesId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        size: true,
        category: true,
        kitchen: true,
        cuisines: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error(`PRODUCTS_GET: ${error}`);

    return new NextResponse("Internal server error", { status: 500 });
  }
}
