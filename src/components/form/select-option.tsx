import { type ReactNode } from "react";
import { Select, SelectItem, type SelectProps } from "@nextui-org/react";

type SelectOptionProps = Omit<SelectProps, "children"> & {
  options: { key: string; value: ReactNode; description?: ReactNode }[];
};

export default function SelectOption({ options, ...rest }: SelectOptionProps) {
  return (
    <Select {...rest}>
      {options.map((item) => (
        <SelectItem
          description={item?.description}
          accessKey={`option-${item.key}`}
          key={item.key}
        >
          {item.value}
        </SelectItem>
      ))}
    </Select>
  );
}
