"use client";

import { ContentLayout } from "@/components";
import { priceFormatter } from "@/lib";
import { AuthProvider } from "@/provider";
import { useCartStore } from "@/stores";
import { Progress, Card, CardBody, CardHeader, Chip } from "@nextui-org/react";
import { Minus, Plus } from "lucide-react";
import dynamic from "next/dynamic";

const MainNavbar = dynamic(() => import("@/components/navbar/main-navbar"), {
  ssr: false,
});

export default function CartPage() {
  const carts = useCartStore((s) => s.carts);

  return (
    <AuthProvider allowedRoles={["user"]}>
      <MainNavbar hideCardBtn />
      <ContentLayout>
        <section className="h-[100px] max-sm:h-[80px] flex items-center">
          <Progress
            value={10}
            size="sm"
            className="max-w-[calc(100vw_-_5%)] w-full mx-auto"
          />
        </section>
        <section
          aria-label="product-carts"
          className="gap-3 grid grid-cols-1 max-w-[75%] w-full mx-auto max-md:max-w-[95%] max-sm:max-w-[100%]"
        >
          {carts.map(({ id, product, amount, price }) => {
            return (
              <Card key={`cart-${id}`} shadow="sm">
                <CardHeader className="flex-col items-start space-y-1">
                  <h3 className="text-xl font-medium">
                    {product.product_name}
                  </h3>
                  {product.description && (
                    <p className="text-slate-500/80 font-[300]">
                      {product.description}
                    </p>
                  )}
                  {product.is_preorder && (
                    <Chip
                      variant="flat"
                      size="sm"
                      color="default"
                      className="text-gray-500/80"
                    >
                      {"Pre-order"}
                    </Chip>
                  )}
                </CardHeader>
                <CardBody className="flex flex-row space-x-3">
                  <img
                    src={product.image[0]}
                    alt="main-image"
                    loading="lazy"
                    className="rounded-lg"
                    width={300}
                  />
                  <div className="flex flex-col space-y-2">
                    <p>{`Price ${priceFormatter(product.price, true)}`}</p>
                    <div className="flex items-center">
                      <p className="mr-2">{"Amout"}</p>
                      <Minus className="w-5 h-5 rounded-sm border cursor-pointer" />
                      <p className="text-sm w-[30px] text-center">
                        {priceFormatter(amount)}
                      </p>
                      <Plus className="w-5 h-5 rounded-sm border cursor-pointer" />
                    </div>
                    <p className="text-primary font-medium">{`Total Price ${priceFormatter(
                      price * amount,
                      true
                    )}`}</p>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </section>
      </ContentLayout>
    </AuthProvider>
  );
}
