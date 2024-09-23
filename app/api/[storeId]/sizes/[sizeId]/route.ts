import prisma from "@/lib/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } },
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("SizeId is Required", { status: 400 });
    }

    const size = await prisma.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    if (!size) {
      return new NextResponse("SizeId not found", { status: 404 });
    }

    return NextResponse.json(size);
  } catch (error) {
    console.error(`SIZE_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } },
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Un-Authenticated", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Size name is missing", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Size value is missing", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is Required", { status: 400 });
    }
    if (!params.sizeId) {
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

    const size = await prisma.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error(`SIZE_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; sizeId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Un-Authenticated", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is Required", { status: 400 });
    }

    if (!params.sizeId) {
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

    const size = await prisma.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error(`SIZE_DELETE: ${error}`, error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
