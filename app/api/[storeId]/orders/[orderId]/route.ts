import prisma from "@/lib/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } },
) {
  try {
    if (!params.orderId) {
      return new NextResponse("orderId is Required", { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: params.orderId,
      },
    });

    if (!order) {
      return new NextResponse("orderId not found", { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(`ORDER_GET: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; orderId: string } },
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { orderStatus } = body;

    if (!userId) {
      return new NextResponse("Un-Authenticated", { status: 400 });
    }

    if (!orderStatus) {
      return new NextResponse("Order orderStatus is missing", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("storeId is Required", { status: 400 });
    }
    if (!params.orderId) {
      return new NextResponse("orderId is Required", { status: 400 });
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

    const order = await prisma.order.updateMany({
      where: {
        id: params.orderId,
      },
      data: {
        orderStatus,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error(`ORDER_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; orderId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Un-Authenticated", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is Required", { status: 400 });
    }

    if (!params.orderId) {
      return new NextResponse("orderId is Required", { status: 400 });
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

    // First, delete all OrderItems associated with the order
    await prisma.orderItem.deleteMany({
      where: {
        orderId: params.orderId,
      },
    });

    // Then, delete the Order itself
    const order = await prisma.order.delete({
      where: {
        id: params.orderId,
      },
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error(`ORDER_DELETE_ERROR: ${error.message}`, error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// export async function DELETE(
//   request: Request,
//   { params }: { params: { storeId: string; orderId: string } }
// ) {
//   try {
//     const { userId } = auth();

//     if (!userId) {
//       return new NextResponse("Un-Authenticated", { status: 400 });
//     }

//     if (!params.storeId) {
//       return new NextResponse("StoreId is Required", { status: 400 });
//     }

//     if (!params.orderId) {
//       return new NextResponse("orderId is Required", { status: 400 });
//     }

//     const storeByUser = await prisma.store.findFirst({
//       where: {
//         id: params.storeId,
//         userId,
//       },
//     });

//     if (!storeByUser) {
//       return new NextResponse("Un-Authorized", { status: 403 });
//     }

//     const order = await prisma.order.deleteMany({
//       where: {
//         id: params.orderId,
//       },
//     });

//     return NextResponse.json(order);
//   } catch (error) {
//     console.error(`ORDER_DELETE_ERROR: ${error}`, error);
//     return new NextResponse("Internal server error", { status: 500 });
//   }
// }
