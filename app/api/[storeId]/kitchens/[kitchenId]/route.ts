import prisma from "@/lib/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { kitchenId: string } },
) {
  try {
    if (!params.kitchenId) {
      return new NextResponse("KitchenId is Required", { status: 400 });
    }

    const kitchens = await prisma.kitchens.findUnique({
      where: {
        id: params.kitchenId,
      },
    });

    if (!kitchens) {
      return new NextResponse("KitchenId not found", { status: 404 });
    }

    return NextResponse.json(kitchens);
  } catch (error) {
    console.error(`KITCHENS_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; kitchenId: string } },
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Un-Authenticated", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Kitchen name is missing", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Kitchen value is missing", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("kitchenId is Required", { status: 400 });
    }
    if (!params.kitchenId) {
      return new NextResponse("sizeId is Required", { status: 400 });
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

    const size = await prisma.kitchens.updateMany({
      where: {
        id: params.kitchenId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error(`KITCHENS_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; kitchenId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Un-Authenticated", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is Required", { status: 400 });
    }

    if (!params.kitchenId) {
      return new NextResponse("kitchenId is Required", { status: 400 });
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

    const size = await prisma.kitchens.deleteMany({
      where: {
        id: params.kitchenId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error(`KITCHENS_DELETE: ${error}`, error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
