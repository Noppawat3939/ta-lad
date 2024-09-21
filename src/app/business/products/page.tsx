"use client";

import { productService } from "@/apis";
import { CustomTable, SellerProductCard, SidebarLayout } from "@/components";
import { useDebounce } from "@/hooks";
import { dateFormatter, isEmpty, priceFormatter, truncate } from "@/lib";
import { Button, Chip, Input, Tab, Tabs, cn } from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlignJustify,
  CircleAlert,
  FolderOpen,
  LayoutGrid,
  PackagePlus,
  Plus,
  SquarePen,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

export default function ProductsPage() {
  const pathname = usePathname();
  const router = useRouter();

  const {
    data,
    isFetching,
    refetch: refetchProducts,
  } = useQuery({
    queryFn: productService.getSellerProductList,
    queryKey: ["seller-product"],
    select: ({ data }) => data?.data || [],
  });

  const updateSkuMutation = useMutation({
    mutationFn: productService.updateSkuProduct,
    onSuccess: () =>
      typeof window !== "undefined"
        ? window.location.reload()
        : router.refresh(),
  });

  const [viewProdcut, setViewProduct] = useState<"list" | "grid">("list");
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const shouldShowSkuUpdate = useMemo(
    () => data?.some((item) => !item.sku),
    [data]
  );

  const products = useMemo(
    () =>
      isEmpty(data)
        ? []
        : data!.map((item) => ({
            key: item.id.toString(),
            product_name: truncate(item.product_name, 40),
            brand: item.brand,
            product_category: item.category_name,
            price: priceFormatter(item.price),
            stock: item.stock_amount,
            sku: item.sku ? (
              <Chip
                variant={"dot"}
                classNames={{ dot: "bg-green-500" }}
                color={"primary"}
                size="sm"
              >
                {item.sku}
              </Chip>
            ) : (
              "-"
            ),
            created_at: dateFormatter(item.created_at, "YYYY-MM-DD"),
            action: (
              <div className="flex space-x-1">
                <Button
                  as={Link}
                  href={`/business/products/view?id=${item.id}`}
                  color="primary"
                  size="sm"
                  isIconOnly
                  variant="light"
                >
                  <FolderOpen className="w-4 h-4" />
                </Button>
                <Button
                  as={Link}
                  href={`/business/products/edit?id=${item.id}`}
                  className="text-gray-600/60"
                  size="sm"
                  isIconOnly
                  variant="light"
                >
                  <SquarePen className="w-4 h-4" />
                </Button>
              </div>
            ),
          })),
    [data]
  );

  const cleanupToLowerCase = (text: string) => text.trim().toLowerCase();

  const productsTable = useMemo(() => {
    const cleanedDebounced = debouncedSearch.toLowerCase().trim();

    const result =
      cleanedDebounced && viewProdcut === "list"
        ? products.filter((product) =>
            [
              cleanupToLowerCase(product.brand).includes(cleanedDebounced),
              cleanupToLowerCase(product.product_name).includes(
                cleanedDebounced
              ),
              cleanupToLowerCase(product.product_category).includes(
                cleanedDebounced
              ),
            ].some(Boolean)
          )
        : products;

    return result;
  }, [products, debouncedSearch, viewProdcut]);

  const productsCard = useMemo(() => {
    const cleanedDebounced = debouncedSearch.toLowerCase().trim();

    const result =
      cleanedDebounced && viewProdcut === "grid"
        ? data?.filter((product) =>
            [
              cleanupToLowerCase(product.brand).includes(cleanedDebounced),
              cleanupToLowerCase(product.product_name).includes(
                cleanedDebounced
              ),
              cleanupToLowerCase(product.category_name).includes(
                cleanedDebounced
              ),
            ].some(Boolean)
          )
        : data;

    return result;
  }, [data, debouncedSearch, viewProdcut, refetchProducts]);

  const renderTable = () => (
    <CustomTable
      isLoading={isFetching || search !== debouncedSearch}
      classNames={{
        wrapper: "max-h-[calc(100vh_-_240px)] overflow-x-auto",
        tBodyRow: "odd:bg-slate-50/60 rounded-sm",
      }}
      headerColumns={{
        product_name: { children: "ชื่อสินค้า", order: 1, width: 240 },
        brand: { children: "แบรนด์", order: 2, width: 180 },
        product_category: {
          children: "หมวดหมู่",
          order: 3,
          width: 150,
        },
        price: { children: "ราคา", order: 4, width: 90 },
        stock: { children: "สต็อก", order: 5, width: 90 },
        sku: { children: "รหัสสินค้า", order: 6, width: 120 },
        created_at: { children: "สร้างเมื่อ", order: 7, width: 120 },
        action: { children: "Action", order: 8, width: 100, align: "center" },
      }}
      bodyColumns={productsTable}
    />
  );

  const renderCards = () => (
    <div
      className={cn(
        "grid gap-4 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1",
        productsCard && productsCard?.length >= 4
          ? "grid-cols-4"
          : "grid-cols-3"
      )}
    >
      {productsCard?.map((product) => (
        <SellerProductCard key={`product-${product.id}`} {...product} />
      ))}
    </div>
  );

  return (
    <SidebarLayout
      activeKey="products"
      classNames={{
        contentLayout: "px-4 py-3",
      }}
    >
      <section className="bg-white">
        <div className="flex justify-between items-center pt-3 pb-1">
          <h1 className="text-2xl text-slate-900 font-semibold">
            {"สินค้าทั้งหมด"}
          </h1>

          <div className="flex flex-[.55] space-x-4">
            <Input
              variant="bordered"
              className="flex-1"
              isClearable
              onClear={() => setSearch("")}
              autoComplete="off"
              classNames={{ input: "placeholder:text-gray-400" }}
              placeholder={"ค้นหา"}
              value={search}
              onChange={({ target: { value } }) => setSearch(value)}
            />
            <Tabs
              isDisabled={isFetching}
              color="primary"
              defaultSelectedKey="list"
              onSelectionChange={(key) => {
                const selected = key as typeof viewProdcut;
                setViewProduct(selected);
              }}
            >
              <Tab title={<AlignJustify className="w-4 h-4" />} key="list" />
              <Tab title={<LayoutGrid className="w-4 h-4" />} key="grid" />
            </Tabs>
            <div className="flex space-x-1">
              <Button
                as={Link}
                href={`${pathname}/insert`}
                startContent={<Plus className="w-4 h-4" />}
                color="primary"
                isLoading={isFetching}
              >
                {"เพิ่มสินค้าใหม่"}
              </Button>

              {shouldShowSkuUpdate && (
                <Button
                  isLoading={updateSkuMutation.isPending}
                  onClick={() => updateSkuMutation.mutate()}
                >
                  <PackagePlus className="w-4 h-4" />
                  {"อัพเดท SKU"}
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-end pb-3">
          <div className="flex items-center space-x-1">
            <CircleAlert className="w-3 h-3 text-orange-400" />
            <p className="text-[10px] font-[300] text-foreground-500">
              {"โปรดอัพเดท SKU เพื่อให้สินค้าของคุณสามารถเข้าถึงลูกค้าได้"}
            </p>
          </div>
        </div>
        <section className="border-2 border-slate-50 p-3 rounded-lg overflow-x-scroll">
          <Suspense>
            {viewProdcut === "list" && renderTable()}
            {viewProdcut === "grid" && renderCards()}
          </Suspense>
        </section>
      </section>
    </SidebarLayout>
  );
}
