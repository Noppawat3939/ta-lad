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

type CustomTableProps = {
  headerColumns: IHeaderColumn;
  bodyColumns: IBodyColumn[];
  classNames?: {
    wrapper?: string;
    tBodyRow?: TableRowProps["className"];
    tBodyCell?: TableCellProps["className"];
  };
} & Pick<TableProps, "topContent">;

export default function CustomTable({
  headerColumns,
  bodyColumns,
  classNames,
  topContent,
}: CustomTableProps) {
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
    return bodyColumns.map((item) => {
      const { key, ...rest } = item;

      return (
        <TableRow key={key} className={classNames?.tBodyRow}>
          {Object.keys(rest).map((f) => (
            <TableCell className={classNames?.tBodyCell} key={f}>
              {item[f]}
            </TableCell>
          ))}
        </TableRow>
      );
    });
  };

  return (
    <Table
      shadow="none"
      radius="md"
      isHeaderSticky
      topContent={topContent}
      classNames={{ wrapper: cn("p-0 rounded", classNames?.wrapper) }}
    >
      <TableHeader>{renderHeader()}</TableHeader>
      <TableBody>{renderBody()}</TableBody>
    </Table>
  );
}
