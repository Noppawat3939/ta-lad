"use client";

import {
  ContentLayout,
  MainFooter,
  MainNavbar,
  ProductCardGroup,
} from "@/components";
import { useGetCategory, useGetProducts } from "@/hooks";
import { Skeleton } from "@nextui-org/react";
import { cn } from "@nextui-org/theme";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

type ProductCategoryPageProps = {
  params: {
    product_category: string;
  };
};

export default function ProductCategoryPage({
  params: { product_category },
}: ProductCategoryPageProps) {
  const router = useRouter();

  const categoryParam = useMemo(
    () => decodeURI(product_category),
    [product_category]
  );

  const { categories, isLoading: loadingCategories } = useGetCategory();
  const { products, isLoading: loadingProducts } = useGetProducts({
    page: 1,
    page_size: 50,
    category_name: categoryParam,
  });

  const goToDetail = (sku = "") =>
    router.push(`/product/${categoryParam}/${sku}`);

  const renderLoaderCategory = () => {
    return (
      <div className="flex flex-col space-y-3">
        {Array.from({ length: 50 })
          .fill("")
          .map((_, i) => (
            <div key={`loader-${i}`}>
              <Skeleton className="w-full h-[24px] rounded-sm" />
            </div>
          ))}
      </div>
    );
  };

  return (
    <main aria-label="product-categories">
      <MainNavbar />
      <ContentLayout className="py-t pb-20">
        <section className="flex min-h-[calc(100dvh_-_180px)]">
          <div className="flex-[.3] min-w-[240px] h-full max-md:hidden">
            <h3 className="font-medium text-lg mb-4" aria-label="title">
              {"เลือกประเภทสินค้า"}
            </h3>
            <ul className="flex flex-col space-y-2 sticky top-[0px]">
              {loadingCategories && renderLoaderCategory()}
              {!loadingCategories &&
                categories?.map((item, i) => (
                  <div
                    key={`category-${i}-${item.id}`}
                    className="py-1 px-3 rounded-sm transition-all duration-200 flex items-center justify-between cursor-pointer text-slate-700 hover:bg-slate-50 hover:text-slate-500"
                  >
                    <p
                      className={cn(
                        "font-[300]",
                        categoryParam === item.name
                          ? "text-primary font-normal"
                          : undefined
                      )}
                      aria-label={`c-${item.name}`}
                    >
                      {item.name}
                    </p>
                    <ChevronRight
                      className={cn(
                        "w-4 h-4",
                        categoryParam === item.name
                          ? "text-primary font-normal"
                          : undefined
                      )}
                    />
                  </div>
                ))}
            </ul>
          </div>
          <div className="h-full flex-1" aria-label="products-group">
            <ProductCardGroup
              data={products}
              isLoading={loadingProducts}
              onClickProduct={(data) => goToDetail(data?.sku)}
            />
          </div>
        </section>
      </ContentLayout>
      <MainFooter />
    </main>
  );
}
