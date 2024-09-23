import prisma from "@/lib/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    if (!params.storeId) {
      return new NextResponse("StoreId is Required", { status: 400 });
    }

    const cuisines = await prisma.cuisines.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(cuisines);
  } catch (error) {
    console.error(`CUISINES_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
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

    const Cuisines = await prisma.cuisines.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(Cuisines);
  } catch (error) {
    console.error(`CUISINES_POST: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
