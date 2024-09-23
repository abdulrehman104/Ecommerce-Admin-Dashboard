import prisma from "@/lib/prismaClient";
import ProductForm from "./components/ProductForm";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const product = await prisma.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
    },
  });

  const category = await prisma.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const size = await prisma.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const kitchen = await prisma.kitchens.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const cuisines = await prisma.cuisines.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          categories={category}
          sizes={size}
          kitchens={kitchen}
          cuisines={cuisines}
        />
      </div>
    </div>
  );
};

export default ProductPage;
