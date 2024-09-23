import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prismaClient";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const OPTIONS = async () => {
  return NextResponse.json({}, { headers: corsHeaders });
};

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } },
) => {
  try {
    const { productIds } = await req.json();
    console.log("Received productIds:", productIds);

    if (!productIds || productIds.length === 0) {
      console.error("Product ids are required");
      return new NextResponse("Product ids are required", { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    console.log("Retrieved products:", products);

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Prepare the line items for the Stripe session
    products.forEach((product) => {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: product.name,
          },
          unit_amount: Math.round(product.price.toNumber() * 100),
        },
      });
    });

    // Add the order to Prisma
    const orderData = await prisma.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        orderStatus: "Processing",
        orderItems: {
          create: productIds.map((productId: string) => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
      },
    });
    console.log("Order created:", orderData);

    console.log("Frontend Store URL:", process.env.FRONTEND_STORE_URL);

    // Create a new Stripe session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancel=1`,

      metadata: {
        orderId: orderData.id,
      },
    });
    console.log("Stripe session created:", session);
    console.log(
      "Success URL:",
      `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    );
    console.log(
      "Cancel URL:",
      `${process.env.FRONTEND_STORE_URL}/cart?cancel=1`,
    );

    // Return the session URL in the response
    return NextResponse.json({ url: session.url }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error during checkout process:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
