import type {
  TableCellProps,
  TableColumnProps,
  TableProps,
  TableRowProps,
} from '@nextui-org/react';
import type { ReactNode } from 'react';

export type IHeaderColumn = Record<
  string,
  {
    children: ReactNode;
    width?: TableColumnProps<any>['width'];
    order: number;
    align?: TableColumnProps<unknown>['align'];
  }
>;

export type IRenderBody = Record<string, ReactNode>;

export type IBodyColumn = {
  key: string;
  width?: TableColumnProps<any>['width'];
} & IRenderBody;

export type CustomTableProps<TBody> = {
  onRow?: (rowData: IBodyColumn, rowIndex: number) => void;
  headerColumns: IHeaderColumn;
  bodyColumns: TBody;
  classNames?: {
    wrapper?: string;
    tBodyRow?: TableRowProps['className'];
    tBodyCell?: TableCellProps['className'];
  };
  isLoading?: boolean;
} & Pick<TableProps, 'topContent'>;
