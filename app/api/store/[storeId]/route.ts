import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prismaClient";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { userId } = auth();
    const { name } = await req.json();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is Required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Store name is missing", { status: 400 });
    }

    const updatedStore = await prisma.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(updatedStore);
  } catch (error) {
    console.error(`STORES_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is Required", { status: 400 });
    }

    const deletedStore = await prisma.store.delete({
      where: {
        id: params.storeId,
        userId,
      },
    });

    return NextResponse.json(deletedStore);
  } catch (error) {
    console.error(`STORES_DELETE: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
