import prisma from "@/lib/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } },
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("categoryId is Required", { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: {
        id: params.categoryId,
      },
    });

    if (!category) {
      return new NextResponse("CategoryId not found", { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error(`CATEGORY_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } },
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Un-Authenticated", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Billboard label is missing", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard image is missing", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is Required", { status: 400 });
    }
    if (!params.categoryId) {
      return new NextResponse("StoreId is Required", { status: 400 });
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

    const category = await prisma.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error(`CATEGORY_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; categoryId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Un-Authenticated", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is Required", { status: 400 });
    }

    if (!params.categoryId) {
      return new NextResponse("categoryId is Required", { status: 400 });
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

    const category = await prisma.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error(`CATEGORY_DELETE: ${error}`, error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
