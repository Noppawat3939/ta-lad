'use client';

import { Fragment, type ReactNode, useMemo } from 'react';
import { Button, cn } from '@nextui-org/react';
import { CornerDownRight, type LucideProps, ShoppingCart, Tag } from 'lucide-react';
import Link from 'next/link';

type Menu = {
  key: string;
  label: ReactNode;
  icon?: LucideProps;
  path?: string;
};

type BussinessAsideProps = {
  activeKey?: string;
  activeSubMenuKey?: string;
  injectSubMenu?: {
    key: string;
    children: {
      key: string;
      label: ReactNode;
      icon?: LucideProps;
    }[];
  };
};

const DEFAULT_MENUS = [
  {
    key: 'products',
    label: 'สินค้าของคุณ',
    icon: <Tag />,
    path: '/business/products',
  },
  {
    key: 'orders',
    label: 'คำสั่งซื้อของคุณ',
    icon: <ShoppingCart />,
    path: '/business/orders',
  },
] as (Menu & { children?: Menu[] })[];

export default function BussinessAside({
  activeKey,
  activeSubMenuKey,
  injectSubMenu,
}: BussinessAsideProps) {
  const menus = useMemo(() => {
    if (injectSubMenu?.key && injectSubMenu.children) {
      return DEFAULT_MENUS.map((m) =>
        m.key === injectSubMenu.key ? { ...m, children: injectSubMenu.children } : m,
      );
    }

    return DEFAULT_MENUS;
  }, [injectSubMenu]);

  return (
    <div className='w-full bg-white sticky top-0 left-0'>
      <section className='flex items-center px-4 h-[100px]'>
        <div className='flex items-center space-x-2'>
          <img className='w-[48px] object-cover' src='/images/logo-primary.png' />
          <h1 className='text-4xl text-slate-900 font-semibold'>{'JUDPI'}</h1>
        </div>
      </section>
      <section className='flex px-3 py-4 flex-col space-y-1'>
        {menus.map((menu) => (
          <div key={menu.key}>
            <Button
              variant='light'
              as={Link}
              href={menu.path}
              className={cn(
                'text-start w-full font-[300]',
                activeKey && activeKey === menu.key ? 'text-[#FF731D] font-medium' : undefined,
              )}
              startContent={
                menu.icon ? <Fragment>{menu.icon as ReactNode}</Fragment> : <Fragment />
              }
            >
              <span aria-label={`menu-label-${menu.key}`} className='w-full'>
                {menu.label}
              </span>
            </Button>

            {menu?.children?.map((subMenu) => (
              <div className='pl-5 flex space-x-1 items-center' key={`sub-menu-${subMenu?.key}`}>
                <CornerDownRight className='w-4 h-4 text-slate-300' />
                <Button
                  variant='light'
                  className={cn(
                    'text-start w-full',
                    activeSubMenuKey && activeSubMenuKey === subMenu.key
                      ? 'text-[#FF731D] font-medium'
                      : undefined,
                  )}
                  startContent={
                    subMenu.icon ? <Fragment>{menu.icon as ReactNode}</Fragment> : <Fragment />
                  }
                >
                  <span
                    aria-label={`menu-label-${subMenu?.key}`}
                    className={cn(
                      'w-full',
                      activeSubMenuKey && subMenu?.key === activeSubMenuKey
                        ? 'text-[#FF731D] font-medium'
                        : 'text-slate-900',
                    )}
                  >
                    {subMenu?.label}
                  </span>
                </Button>
              </div>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}
