"use client";

import { ContentLayout, MainFooter, MainNavbar } from "@/components";
import { useGetCategory } from "@/hooks";
import { cn } from "@nextui-org/theme";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";

type ProductCategoryPageProps = {
  params: {
    product_category: string;
  };
};

export default function ProductCategoryPage({
  params: { product_category },
}: ProductCategoryPageProps) {
  const { categories } = useGetCategory();

  const categoryParam = useMemo(
    () => decodeURI(product_category),
    [product_category]
  );

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
              {categories?.map((item, i) => (
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
          <div className="border border-orange-500 h-full flex-1">
            category list
          </div>
        </section>
      </ContentLayout>
      <MainFooter />
    </main>
  );
}
