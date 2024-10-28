"use client";

import { ContentLayout } from "@/components";
import { AuthProvider } from "@/provider";
import { useCartStore } from "@/stores";
import { Progress, Card, CardBody, CardHeader } from "@nextui-org/react";
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
          {carts.map(({ id, product }) => {
            return (
              <Card key={`cart-${id}`} shadow="sm">
                <CardHeader>
                  <h3 className="text-xl font-medium">
                    {product.product_name}
                  </h3>
                  <p className="text-slate-500/80 font-[300]">
                    {product.description || ""}
                  </p>
                </CardHeader>
                <CardBody>
                  <img
                    src={product.image[0]}
                    alt="main-image"
                    loading="lazy"
                    className="rounded-lg"
                    width={300}
                  />
                </CardBody>
              </Card>
            );
          })}
        </section>
      </ContentLayout>
    </AuthProvider>
  );
}
