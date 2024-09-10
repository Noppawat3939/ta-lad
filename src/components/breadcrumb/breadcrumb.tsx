import {
  type BreadcrumbItemProps,
  BreadcrumbItem,
  Breadcrumbs,
  BreadcrumbsProps,
} from "@nextui-org/react";

type BreadcrumbProps = {
  items: { key: string; label: string; href: BreadcrumbItemProps["href"] }[];
  props?: {
    base?: BreadcrumbsProps;
    item?: BreadcrumbItemProps;
  };
};

export default function Breadcrumb({ items, props }: BreadcrumbProps) {
  return (
    <Breadcrumbs {...props?.base}>
      {items.map((item) => (
        <BreadcrumbItem href={item.href} key={item.key} {...props?.item}>
          {item.label}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}
