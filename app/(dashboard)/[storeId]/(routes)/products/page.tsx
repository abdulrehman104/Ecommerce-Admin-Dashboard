import prisma from "@/lib/prismaClient";
import { formatter } from "@/lib/utils";

import { ProductColumns } from "./components/columns";
import ProductClients from "./components/ProductClients";

import { format } from "date-fns";

const Products = async ({ params }: { params: { storeId: string } }) => {
  const productsData = await prisma.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      kitchen: true,
      cuisines: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedData: ProductColumns[] = productsData.map((items) => ({
    id: items.id,
    name: items.name,
    isFeatured: items.isFeatured,
    isArchived: items.isArchived,
    price: formatter.format(items.price.toNumber()),
    category: items.category.name,
    size: items.size.value,
    kitchen: items.kitchen.value,
    cuisines: items.cuisines.name,
    createdAt: format(items.createdAt, "MMMM do , yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClients data={formatedData} />
      </div>
    </div>
  );
};

export default Products;
