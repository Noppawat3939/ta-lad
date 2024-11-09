"use client";

import { useEffect } from "react";
import {
  ContentLayout,
  ProductCategoryCardGroup as CategoriesCards,
  ProductCardGroup,
  MainFooter,
} from "@/components";
import { useSearchKeywordStore } from "@/stores";
import { useShortcutKey, useGetUser, useProductCart } from "@/hooks";
import { useQueries } from "@tanstack/react-query";
import { productService } from "@/apis";
import type {
  CategoryResponse,
  GetProductsList,
} from "@/apis/internal/products";
import { Link } from "@nextui-org/react";
import { ChevronRight } from "lucide-react";
import type { Product } from "@/types";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const MainNavbar = dynamic(() => import("@/components/navbar/main-navbar"), {
  ssr: false,
});

function Home() {
  const router = useRouter();

  const { userData } = useGetUser();

  const { getCarts } = useProductCart();

  const data = useQueries({
    queries: [
      {
        queryKey: ["product-list"],
        queryFn: () =>
          productService.getProductList({ page_size: 50, page: 1 }),
        select: (res: GetProductsList) => res.data?.data,
      },
      {
        queryKey: ["category"],
        queryFn: productService.getCategoryList,
        select: ({ data }: CategoryResponse) => data?.data,
      },
    ],
  });

  useEffect(() => {
    if (userData?.id) {
      getCarts();
    }
  }, [userData]);

  const products = data[0] || [];

  const categories = data[1] || [];

  const { open, onClose, onOpen } = useSearchKeywordStore();

  useShortcutKey({ callback: () => (open ? onClose() : onOpen()) });

  const handleClickProduct = (product?: Product) => {
    if (product?.category_name && product.sku) {
      router.push(
        `/product/${encodeURI(product.category_name)}/${product.sku}`
      );
    }
  };

  return (
    <section className="flex flex-col items-center bg-slate-50 min-h-screen">
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
            onClickProduct={handleClickProduct}
          />
        </section>
      </ContentLayout>
      <MainFooter />
    </section>
  );
}

export default function HomePage() {
  return (
    // <Suspense>
    <Home />
    // </Suspense>
  );
}
