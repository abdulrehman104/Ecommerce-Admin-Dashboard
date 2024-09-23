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

    const order = await prisma.order.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error(`ORDER_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
