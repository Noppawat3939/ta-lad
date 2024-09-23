"use client";

import { productService } from "@/apis";
import {
  CustomTable,
  GroupProductsModal,
  SellerProductCard,
  SidebarLayout,
} from "@/components";
import { useDebounce } from "@/hooks";
import { dateFormatter, isEmpty, priceFormatter, truncate } from "@/lib";
import { Product } from "@/types";
import {
  Button,
  Checkbox,
  Chip,
  Image,
  Input,
  Tab,
  Tabs,
  cn,
} from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlignJustify,
  CircleAlert,
  FolderOpen,
  Group,
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

  const [viewProdcut, setViewProduct] = useState<"list" | "grid">("list");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number[]>([]);
  const [groupProducts, setGroupProducts] = useState<{
    isOpen: boolean;
    products: Pick<Product, "id" | "image">[];
  }>({
    isOpen: false,
    products: [],
  });

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

  const insertGroupMutation = useMutation({
    mutationFn: productService.insertgroupProducts,
    onSuccess: () => {
      setSelectedId([]);
      setGroupProducts({ products: [], isOpen: false });
      refetchProducts();
    },
  });

  const debouncedSearch = useDebounce(search, 500);

  const shouldShowSkuUpdate = useMemo(
    () => data?.some((item) => !item.sku),
    [data]
  );

  const handleSelectProductId = (checked: boolean, productId: number) => {
    setSelectedId((prevId) => {
      if (prevId.length > 0 && prevId.includes(productId)) {
        return prevId.filter((id) => id !== productId);
      }

      if (checked) {
        if (isEmpty(prevId)) return [productId];

        return [...prevId, productId];
      } else {
        return prevId;
      }
    });
  };

  const products = useMemo(
    () =>
      isEmpty(data)
        ? []
        : data!.map((item) => ({
            key: item.id.toString(),
            select: (
              <Checkbox
                value={String(item.id)}
                checked={selectedId && selectedId.includes(item.id)}
                onChange={(e) =>
                  handleSelectProductId(e.target.checked, +e.target.value)
                }
              />
            ),
            group_id: item.group_product?.id,
            image: (
              <Image
                src={item.image[0]}
                loading="lazy"
                alt="product-image"
                className="min-w-[42px] max-w-[42px] h-[42px] rounded-full object-cover"
              />
            ),
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
        select: { children: "", order: 1, width: 30 },
        group_id: { children: "group_id", order: 2, width: 40 },
        image: { children: "", order: 3, width: 60 },
        product_name: { children: "ชื่อสินค้า", order: 4, width: 240 },
        brand: { children: "แบรนด์", order: 5, width: 180 },
        product_category: {
          children: "หมวดหมู่",
          order: 6,
          width: 120,
        },
        price: { children: "ราคา", order: 7, width: 80 },
        stock: { children: "สต็อก", order: 8, width: 80 },
        sku: { children: "รหัสสินค้า", order: 9, width: 120 },
        created_at: { children: "สร้างเมื่อ", order: 10, width: 120 },
        action: { children: "Action", order: 11, width: 100, align: "center" },
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

          <div className="flex items-center flex-[.55] space-x-3">
            <Input
              variant="bordered"
              className="flex-1"
              isClearable
              onClear={() => setSearch("")}
              autoComplete="off"
              classNames={{ input: "placeholder:text-gray-400" }}
              placeholder={"ค้นหา"}
              value={search}
              size="sm"
              onChange={({ target: { value } }) => setSearch(value)}
            />
            <Tabs
              isDisabled={isFetching}
              color="primary"
              size="sm"
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
                size="sm"
              >
                {"เพิ่มสินค้าใหม่"}
              </Button>

              {shouldShowSkuUpdate && (
                <Button
                  size="sm"
                  isLoading={updateSkuMutation.isPending}
                  onClick={() => updateSkuMutation.mutate()}
                >
                  <PackagePlus className="w-4 h-4" />
                  {"อัพเดท SKU"}
                </Button>
              )}

              <Button
                size="sm"
                onClick={() => {
                  if (data && data?.length > 0) {
                    const filteredSelect = data
                      ?.filter((item) => selectedId.includes(item.id))
                      ?.map((item) => ({
                        id: item.id,
                        image: item.image,
                      }));
                    setGroupProducts({
                      products: filteredSelect,
                      isOpen: true,
                    });
                  }
                }}
                isDisabled={isEmpty(selectedId)}
              >
                <Group className="w-4 h-4" />
                {"รวมกลุ่มสินค้า"}
              </Button>
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
      <GroupProductsModal
        isOpen={groupProducts.isOpen}
        products={groupProducts.products}
        onClose={() => setGroupProducts({ products: [], isOpen: false })}
        onGroup={(data) => insertGroupMutation.mutate(data)}
      />
    </SidebarLayout>
  );
}
