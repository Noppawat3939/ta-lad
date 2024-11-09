import { ProductCategory } from "@/types";
import { Card, CardBody, CardFooter, Skeleton, cn } from "@nextui-org/react";
import { Suspense } from "react";

type ProductCategoryCardGroupProps = {
  data?: ProductCategory[];
  isLoading?: boolean;
  classNames?: {
    container?: string;
  };
};

export default function ProductCategoryCardGroup({
  data = [],
  isLoading = false,
  classNames,
}: ProductCategoryCardGroupProps) {
  const categories = isLoading
    ? (Array.from({ length: 20 }).fill({
        name: "",
        image: "",
      }) as unknown as typeof data)
    : data;

  return (
    <Suspense>
      <section
        aria-label="group-container"
        className={cn("w-full h-full", classNames?.container)}
      >
        <div className="grid gap-3 grid-cols-8 max-xl:grid-cols-7 max-lg:grid-cols-6 max-md:grid-cols-4 max-sm:grid-cols-2">
          {categories?.map((item, i) => (
            <Card
              key={`category-${i}`}
              shadow="none"
              className="z-0 rounded-md cursor-pointer p-0 transition-all duration-200 hover:shadow hover:text-[#FF731D]"
            >
              <CardBody className="pb-0">
                <div className="flex flex-col justify-center items-center">
                  <div
                    className="flex items-center justify-center bg-gray-50 rounded-full w-[80px] h-[80px]"
                    aria-label="image-wrapper"
                  >
                    {isLoading ? (
                      <Skeleton className="w-[60px] h-[60px] rounded-full" />
                    ) : (
                      <img
                        className="w-[60px] h-[60px] rounded-full object-cover"
                        src={item.image}
                        alt={`${item.name}`}
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>
              </CardBody>
              <CardFooter className="pt-0">
                {isLoading || !item.name ? (
                  <Skeleton
                    aria-label="loader-name"
                    className="w-full mt-2 h-[8px] rounded-sm"
                  />
                ) : (
                  <p
                    aria-label="category-name"
                    className="text-[12px] text-center w-full"
                  >
                    {item.name}
                  </p>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </Suspense>
  );
}
