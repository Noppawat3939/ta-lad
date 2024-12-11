'use client';

import { CustomTable, SidebarLayout } from '@/components';
import { dateFormatter, priceFormatter, truncate } from '@/lib';
import { useCartStore } from '@/stores';
import { Chip } from '@nextui-org/react';

export default function OrdersPage() {
  const carts = useCartStore((s) => s.carts);

  const renderTable = () => (
    <CustomTable
      classNames={{
        wrapper: 'max-h-[calc(100vh_-_240px)] overflow-x-auto',
        tBodyRow: 'odd:bg-slate-50/60 rounded-sm',
      }}
      headerColumns={{
        sku: { children: 'รหัสสินค้า', order: 1, width: 150 },
        product_name: { children: 'ชื่อสินค้า', order: 2, width: 150 },
        brand: { children: 'แบรนด์', order: 3, width: 100 },
        cart_status: { children: 'สถานะตระกร้า', order: 4, width: 120 },
        user_name: { children: 'ชื่อผู้ใช้งาน', order: 5, width: 200 },
        amount: { children: 'จำนวน', order: 6, width: 80 },
        price: { children: 'ราคา', order: 7, width: 80 },
        total_price: { children: 'ราคาทั้งหมด', order: 8, width: 100 },
        created_at: { children: 'วันที่สร้างรายการ', order: 9, width: 120 },
      }}
      bodyColumns={carts.map((cart) => ({
        product_name: cart.product.product_name,
        brand: cart.product.brand,
        sku: cart.product.sku,
        amount: cart.amount,
        price: priceFormatter(cart.amount),
        total_price: priceFormatter(cart.amount * cart.price),
        user_name: truncate(`${cart.user?.first_name || ''} ${cart.user?.last_name || ''}`, 20),
        cart_status: (
          <Chip
            size='sm'
            color={
              cart.status === 'paid'
                ? 'success'
                : cart.status === 'cancelled'
                  ? 'danger'
                  : 'default'
            }
            variant={cart.status === 'paid' ? 'solid' : 'bordered'}
          >
            {cart.status}
          </Chip>
        ),
        created_at: dateFormatter(cart.created_at, 'DD/MM/YYYY'),
      }))}
    />
  );

  return (
    <SidebarLayout
      activeKey='orders'
      classNames={{
        contentLayout: 'px-4 py-3',
      }}
    >
      <section className='bg-white'>
        <h1 aria-label='page-title' className='text-2xl text-slate-900 font-semibold'>
          {'รายการคำสั่งซื้อ'}
        </h1>

        <div className='flex flex-col'>{renderTable()}</div>
      </section>
    </SidebarLayout>
  );
}
