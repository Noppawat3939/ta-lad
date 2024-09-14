import { Card, CardBody, Skeleton, cn } from "@nextui-org/react";

type ProductCardLoaderProps = {
  classNames?: { card?: string; cardBody?: string };
};

export default function ProductCardLoader({
  classNames,
}: ProductCardLoaderProps) {
  return (
    <Card
      shadow="none"
      className={cn("border w-full border-slate-50", classNames?.card)}
      radius="sm"
    >
      <CardBody
        className={cn("flex flex-col justify-between", classNames?.cardBody)}
      >
        <Skeleton className="w-[90%] mx-auto min-h-[200px] rounded" />
        <Skeleton className="w-full h-[16px] rounded mt-[30px]" />
        <Skeleton className="w-full h-[12px] rounded mt-2" />
      </CardBody>
    </Card>
  );
}
