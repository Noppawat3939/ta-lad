'use client';

import { ContentLayout, Modal } from '@/components';
import { useCount } from '@/hooks';
import { priceFormatter } from '@/lib';
import { AuthProvider } from '@/provider';
import { useCartStore, useModalStore, useUserStore } from '@/stores';
import { Progress, Card, CardBody, CardHeader, Chip, Button, Spinner } from '@nextui-org/react';
import { Minus, Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Fragment, useEffect, useMemo } from 'react';

const MainNavbar = dynamic(() => import('@/components/navbar/main-navbar'), {
  ssr: false,
});

export default function CartPage() {
  const { carts, loading: cartsLoading } = useCartStore();
  const user = useUserStore((s) => s.user);

  const { countList, onIncreaseList, onDecreaseList, setCountList } = useCount();

  const { setModalState } = useModalStore();

  useEffect(() => {
    if (carts.length > 0) {
      setCountList(carts.map((cart) => cart.amount));
    }
  }, [carts]);

  const handleRemoveCart = (cartId: number) => {
    setModalState({
      isOpen: true,
      title: 'Are you sure remove this cart ?',
      okBtnProps: { color: 'danger' },
      onOk: () => {
        console.log('removed !', cartId);
      },
    });
  };

  const memorizedTotalPrice = useMemo(
    () =>
      carts.length > 0
        ? carts
            .map((cart, i) => ({ price: cart.price, amount: countList[i] }))
            .reduce((total, cur) => (total += cur.price * cur.amount), 0)
        : 0,
    [carts, countList],
  );

  return (
    <AuthProvider allowedRoles={['user']}>
      <MainNavbar hideCardBtn />
      <ContentLayout>
        {!user && (
          <div className='flex justify-center items-center h-[calc(100dvh_-_140px)]'>
            <div className='flex flex-col items-center'>
              <h4 className='text-lg'>{'ไม่พบตระกร้าสินค้าของคุณ'}</h4>
              <p className='text-slate-500/80 mb-2'>{'กรุณาเข้าสู่ระบบ'}</p>
              <Button
                passHref
                color='primary'
                rel='noreferer'
                as={Link}
                href='/login/end-user?callback=cart'
              >
                {'ล็อคอิน'}
              </Button>
            </div>
          </div>
        )}
        {user && cartsLoading && (
          <div className='flex items-center justify-center h-[calc(100vh-100px)]'>
            <Spinner />
          </div>
        )}
        {user && !cartsLoading && (
          <Fragment>
            <section className='h-[100px] max-sm:h-[80px] flex items-center'>
              <Progress value={10} size='sm' className='max-w-[calc(100vw_-_5%)] w-full mx-auto' />
            </section>
            <section className='flex border-b pb-2 justify-end items-center space-x-4 mb-4'>
              <span aria-label='total-price' className='text-sm font-medium flex'>
                {'Total price (THB)'}
                <p className='ml-1 text-primary'>{priceFormatter(memorizedTotalPrice)}</p>
              </span>
              <Button aria-label='checkout-btn' isDisabled={memorizedTotalPrice === 0}>
                {'Checkout'}
              </Button>
            </section>
            <section
              aria-label='product-carts'
              className='gap-3 grid grid-cols-1 max-w-[75%] w-full mx-auto max-md:max-w-[95%] max-sm:max-w-[100%]'
            >
              {carts.map(({ id, product, price }, i) => {
                return (
                  <Card key={`cart-${id}`} shadow='sm'>
                    <CardHeader className='flex-col items-start space-y-1'>
                      <div className='flex w-full justify-between items-center'>
                        <h3 className='text-xl font-medium'>{product.product_name}</h3>
                        <Button
                          onClick={() => handleRemoveCart(id)}
                          size='sm'
                          aria-label='remove-cart'
                          color='danger'
                        >
                          {'Remove'}
                        </Button>
                      </div>
                      {product.description && (
                        <p className='text-slate-500/80 font-[300]'>{product.description}</p>
                      )}
                      <div className='flex space-x-2'>
                        {product.is_preorder && (
                          <Chip
                            variant='flat'
                            size='sm'
                            color='default'
                            className='text-gray-500/80'
                          >
                            {'Pre-order'}
                          </Chip>
                        )}
                        <Chip size='sm' variant='bordered' color='primary'>
                          {product.category_name}
                        </Chip>
                      </div>
                    </CardHeader>
                    <CardBody className='flex flex-row space-x-3'>
                      <img
                        src={product.image[0]}
                        alt='main-image'
                        loading='lazy'
                        className='rounded-lg'
                        width={300}
                      />
                      <div className='flex flex-col space-y-2'>
                        <div className='flex items-center'>
                          <p className='mr-2'>{'Amout'}</p>
                          <Button
                            aria-label='decrease-btn'
                            isDisabled={countList[i] <= 0}
                            size='sm'
                            isIconOnly
                            onClick={() => onDecreaseList(i)}
                          >
                            <Minus className='w-4 h-4' />
                          </Button>
                          <p className='text-sm w-[30px] text-center'>
                            {priceFormatter(countList[i])}
                          </p>
                          <Button
                            aria-label='increase-btn'
                            size='sm'
                            isIconOnly
                            isDisabled={countList[i] >= product.stock_amount}
                            onClick={() => onIncreaseList(i)}
                          >
                            <Plus className='w-4 h-4' />
                          </Button>
                        </div>
                        <p aria-label='price-per-amount'>{`Price ${priceFormatter(price)}`}</p>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </section>
          </Fragment>
        )}
      </ContentLayout>
      <Modal />
    </AuthProvider>
  );
}
