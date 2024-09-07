"use client";

import { Suspense } from "react";
import {
  ContentLayout,
  MainNavbar,
  ProductCategoryCardGroup as CategoriesCards,
  ProductCardGroup,
  MainFooter,
} from "@/components";
import { useSearchKeywordStore } from "@/stores";
import { useShortcutKey } from "@/hooks";
import { useQueries } from "@tanstack/react-query";
import { productService } from "@/apis";
import { CategoryResponse, GetProductsList } from "@/apis/internal/products";
import { Link } from "@nextui-org/react";
import { ChevronRight } from "lucide-react";

function Home() {
  const data = useQueries({
    queries: [
      {
        queryKey: ["product-list"],
        queryFn: () => productService.getProductList({ limit: 50, page: 1 }),
        select: (res: GetProductsList) => res.data?.data,
      },
      {
        queryKey: ["category"],
        queryFn: productService.getCategoryList,
        select: ({ data }: CategoryResponse) => data?.data,
      },
    ],
  });
  const products = data[0] || [];

  const categories = data[1] || [];

  const { open, onClose, onOpen } = useSearchKeywordStore();

  useShortcutKey({ callback: () => (open ? onClose() : onOpen()) });

  const handleAddToCart = (sku: string) => {
    let carts: { id: number; sku: string }[] = [];
    carts = [...carts, { id: carts.length + 1, sku }];
  };

  return (
    <main className="flex flex-col items-center bg-slate-50 min-h-screen">
      <MainNavbar />
      <section className="py-4 w-full z-0">
        <CategoriesCards
          data={categories.data}
          isLoading={categories.isLoading}
          classNames={{
            container:
              "max-w-[1240px] mx-auto px-2 max-lg:max-w-[768px] max-md:px-4",
          }}
        />
      </section>
      <ContentLayout>
        <section className="py-4 flex flex-col items-stretch">
          <div className="flex justify-between items-center py-3">
            <h3 className="font-medium">{"สินค้าสำหรับคุณ"}</h3>
            <Link href="/" className="text-sm flex items-center">
              {"ดูเพิ่มเติม"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <ProductCardGroup
            data={products.data}
            isLoading={products.isLoading}
            onClickToCart={handleAddToCart}
          />
        </section>
      </ContentLayout>
      <MainFooter />
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}
