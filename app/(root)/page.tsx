import ProductSkeleton from '@/components/skeleton/ProductSkeleton';
import ProducListServerWrapper from '@/components/wrapper/ProducListServerWrapper';
import { Suspense } from 'react';

export default async function Home() {
  return (
      <Suspense fallback={ <ProductSkeleton />}>
        <ProducListServerWrapper />
      </Suspense>
  );
}
