import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  cn,
  Spinner,
} from '@nextui-org/react';
import { Package } from 'lucide-react';
import type { CustomTableProps, IBodyColumn, IRenderBody } from './type';
import { isEmpty } from '@/lib';
import { useMemo } from 'react';

export default function CustomTable<TBody extends any[]>({
  headerColumns,
  bodyColumns,
  classNames,
  topContent,
  onRow,
  isLoading = false,
}: CustomTableProps<TBody>) {
  const sortedHeaders = Object.keys(headerColumns)
    .map((key) => ({ ...headerColumns[key], key }))
    .sort((a, b) => a.order - b.order);

  const renderHeader = () => {
    return sortedHeaders.map((hCol) => (
      <TableColumn key={hCol.key} width={hCol?.width} align={hCol.align || 'start'}>
        {hCol.children}
      </TableColumn>
    ));
  };

  const sortedKeys = useMemo(
    () =>
      Object.keys(headerColumns).sort((a, b) => headerColumns[a].order - headerColumns[b].order),
    [headerColumns],
  );

  const sortedBodyData = useMemo(
    () =>
      bodyColumns.map((item) => {
        const sortedEntry: IRenderBody = {};

        sortedKeys.forEach((key) => {
          sortedEntry[key as keyof typeof sortedEntry] = item[key];
        });
        return sortedEntry;
      }),
    [bodyColumns, sortedKeys],
  );

  const renderBody = () =>
    sortedBodyData.map((item, i) => {
      return (
        <TableRow
          onClick={() => onRow?.(item as IBodyColumn, i)}
          key={`row-${i}`}
          className={classNames?.tBodyRow}
        >
          {Object.keys(item).map((restItem, i) => (
            <TableCell className={classNames?.tBodyCell} key={`${restItem}-${i}`}>
              {item[restItem]}
            </TableCell>
          ))}
        </TableRow>
      );
    });

  return (
    <Table
      shadow='none'
      radius='md'
      isHeaderSticky
      topContent={topContent}
      classNames={{
        wrapper: cn('p-0 rounded min-w-[1100px]', classNames?.wrapper),
      }}
    >
      <TableHeader>{renderHeader()}</TableHeader>
      <TableBody
        isLoading={isLoading}
        loadingContent={<Spinner size='sm' />}
        emptyContent={
          isEmpty(bodyColumns) ? (
            <div className='flex text-gray-300 flex-col justify-center space-y-2 mx-auto items-center w-fit'>
              <Package className='w-6 h-6' />
              <p className='text-sm'>{'no data'}</p>
            </div>
          ) : undefined
        }
      >
        {isEmpty(bodyColumns) ? [] : renderBody()}
      </TableBody>
    </Table>
  );
}
