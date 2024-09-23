import prisma from "@/lib/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { name } = await req.json();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Store name is missing", { status: 400 });
    }

    const storeData = await prisma.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(storeData);
  } catch (error) {
    console.error(`STORES_POST: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
