import prisma from "@/lib/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { cuisinesId: string } },
) {
  try {
    if (!params.cuisinesId) {
      return new NextResponse("CuisinesId is Required", { status: 400 });
    }

    const cuisines = await prisma.cuisines.findUnique({
      where: {
        id: params.cuisinesId,
      },
    });

    if (!cuisines) {
      return new NextResponse("CuisinesId not found", { status: 404 });
    }

    return NextResponse.json(cuisines);
  } catch (error) {
    console.error(`CUISINES_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; cuisinesId: string } },
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Un-Authenticated", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Cuisines name is missing", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Cuisines value is missing", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("storeId is Required", { status: 400 });
    }
    if (!params.cuisinesId) {
      return new NextResponse("cuisinesId is Required", { status: 400 });
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

    const cuisines = await prisma.cuisines.updateMany({
      where: {
        id: params.cuisinesId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(cuisines);
  } catch (error) {
    console.error(`CUISINES_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; cuisinesId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Un-Authenticated", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is Required", { status: 400 });
    }

    if (!params.cuisinesId) {
      return new NextResponse("cuisinesId is Required", { status: 400 });
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

    const cuisines = await prisma.cuisines.deleteMany({
      where: {
        id: params.cuisinesId,
      },
    });

    return NextResponse.json(cuisines);
  } catch (error) {
    console.error(`CUISINES_DELETE: ${error}`, error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
