import {
  type TableRowProps,
  type TableColumnProps,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  cn,
  TableCellProps,
  TableProps,
} from "@nextui-org/react";
import { Package } from "lucide-react";
import { ReactNode } from "react";

type IHeaderColumn = Record<
  string,
  {
    children: ReactNode;
    width?: TableColumnProps<any>["width"];
    order: number;
  }
>;

type IBodyColumn = {
  key: string;
  width?: TableColumnProps<any>["width"];
} & Record<string, ReactNode>;

type CustomTableProps<TBody> = {
  onRow?: (rowData: IBodyColumn, rowIndex: number) => void;
  headerColumns: IHeaderColumn;
  bodyColumns: IBodyColumn[] | TBody;
  classNames?: {
    wrapper?: string;
    tBodyRow?: TableRowProps["className"];
    tBodyCell?: TableCellProps["className"];
  };
} & Pick<TableProps, "topContent">;

export default function CustomTable<TBody extends any[]>({
  headerColumns,
  bodyColumns,
  classNames,
  topContent,
  onRow,
}: CustomTableProps<TBody>) {
  const renderHeader = () => {
    const mapped = Object.keys(headerColumns)
      .map((key) => ({ ...headerColumns[key], key }))
      .sort((a, b) => a.order - b.order);

    return mapped.map((hCol) => (
      <TableColumn key={hCol.key} width={hCol?.width}>
        {hCol.children}
      </TableColumn>
    ));
  };

  const renderBody = () => {
    return bodyColumns.map((item, i) => {
      const { key, ...rest } = item;

      return (
        <TableRow
          onClick={() => onRow?.(item, i)}
          key={key}
          className={classNames?.tBodyRow}
        >
          {Object.keys(rest).map((restItem, i) => (
            <TableCell
              className={classNames?.tBodyCell}
              key={`${restItem}-${i}`}
            >
              {item[restItem]}
            </TableCell>
          ))}
        </TableRow>
      );
    });
  };

  const isEmptyData = bodyColumns.length === 0;

  return (
    <Table
      shadow="none"
      radius="md"
      isHeaderSticky
      topContent={topContent}
      classNames={{ wrapper: cn("p-0 rounded", classNames?.wrapper) }}
    >
      <TableHeader>{renderHeader()}</TableHeader>
      <TableBody
        emptyContent={
          isEmptyData ? (
            <div className="flex text-gray-300 flex-col justify-center space-y-2 mx-auto items-center w-fit">
              <Package className="w-6 h-6" />
              <p className="text-sm">{"no data"}</p>
            </div>
          ) : undefined
        }
      >
        {isEmptyData ? [] : renderBody()}
      </TableBody>
    </Table>
  );
}
