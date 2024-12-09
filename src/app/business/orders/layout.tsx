import { AuthProvider } from '@/provider';
import { Metadata } from 'next';
import { type PropsWithChildren } from 'react';

type OrdersLayoutProps = Readonly<PropsWithChildren>;

export const metadata: Metadata = {
  title: 'JUDPI - ระบบจัดการสินค้าของคุณ',
  keywords: ['products', 'insert-product', 'orders'],
};

export default function OrdersLayout({ children }: OrdersLayoutProps) {
  return (
    <AuthProvider allowedRoles={['store']}>
      <section aria-label='orders-layout'>{children}</section>
    </AuthProvider>
  );
}
