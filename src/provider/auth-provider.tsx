'use client';

import { useEffect, type PropsWithChildren } from 'react';
import { useGetUser, useProductCart } from '@/hooks';
import type { Role } from '@/types';
import { isEmpty } from '@/lib';
import { Spinner } from '@nextui-org/react';
import { NotFoundContainer } from '@/components';

type AuthProviderProps = Readonly<PropsWithChildren> & {
  allowedRoles?: Role[];
};

export default function AuthProvider({ children, allowedRoles }: AuthProviderProps) {
  const { userData, isFetching } = useGetUser();

  const { getCarts, _get } = useProductCart();

  useEffect(() => {
    if (userData?.id) {
      getCarts();
    }
  }, [userData]);

  if (userData && !isEmpty(allowedRoles) && !allowedRoles?.includes(userData.role))
    return <NotFoundContainer />;

  return (
    <section
      suppressHydrationWarning={true}
      aria-label='auth-container'
      allowed-user={userData?.email ? 'true' : 'false'}
    >
      {isFetching || _get.isPending ? (
        <div className='flex flex-1 justify-center items-center h-screen'>
          <Spinner size='sm' />
        </div>
      ) : (
        children
      )}
    </section>
  );
}
