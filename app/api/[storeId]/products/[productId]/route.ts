import prisma from "@/lib/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } },
) {
  try {
    if (!params.productId) {
      return new NextResponse("productId is Required", { status: 400 });
    }

    const products = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        size: true,
        category: true,
        kitchen: true,
        cuisines: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error(`PRODUCT_GET: ${error}`);

    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } },
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      price,
      images,
      isFeatured,
      isArchived,
      categoryId,
      sizeId,
      kitchenId,
      cuisinesId,
    } = body;

    if (!userId) {
      return new NextResponse("Un-Authenticated", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Product name is missing", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Product price is missing", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Product images are missing", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category is missing", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size is missing", { status: 400 });
    }

    if (!kitchenId) {
      return new NextResponse("Kitchen is missing", { status: 400 });
    }

    if (!cuisinesId) {
      return new NextResponse("Cuisines are missing", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }
    if (!params.productId) {
      return new NextResponse("ProductId is required", { status: 400 });
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

    // Fetch the current images of the product
    const currentProduct = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
      },
    });

    if (!currentProduct) {
      return new NextResponse("Product not found", { status: 404 });
    }

    const currentImageUrls = currentProduct.images.map((img) => img.url);

    // Determine images to delete
    const imagesToDelete = currentImageUrls.filter(
      (url) => !images.some((img: { url: string }) => img.url === url),
    );

    // Determine images to add
    const imagesToAdd = images.filter(
      (img: { url: string }) => !currentImageUrls.includes(img.url),
    );

    // Update the product details
    await prisma.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        sizeId,
        kitchenId,
        cuisinesId,
        storeId: params.storeId,
      },
    });

    // Delete images that are not in the new images list
    if (imagesToDelete.length > 0) {
      await prisma.image.deleteMany({
        where: {
          url: {
            in: imagesToDelete,
          },
        },
      });
    }

    // Add new images
    if (imagesToAdd.length > 0) {
      await prisma.image.createMany({
        data: imagesToAdd.map((img: { url: string }) => ({
          url: img.url,
          productId: params.productId,
        })),
      });
    }

    // Fetch the updated product with images
    const updatedProduct = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(`PRODUCT_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; productId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Un-Authenticated", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is Required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("ProductId is Required", { status: 400 });
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

    const product = await prisma.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error(`PRODUCT_DELETE: ${error}`, error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
