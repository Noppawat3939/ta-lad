'use client';

import { SidebarLayout } from '@/components';

export default function OrdersPage() {
  return (
    <SidebarLayout
      activeKey='orders'
      classNames={{
        contentLayout: 'px-4 py-3',
      }}
    >
      <section className='bg-white'>Orders page</section>
    </SidebarLayout>
  );
}
