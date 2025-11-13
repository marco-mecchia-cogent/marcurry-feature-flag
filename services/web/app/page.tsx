import { StatsCard } from '@/components/stats-card';
import { Flag } from 'lucide-react';
import { FeaturesTable } from '@/components/feature-usage-table';
import { ProductSelector } from '@/components/product-selector';
import { EnvironmentSelector } from '@/components/environment-selector';
import { CreateProductInline } from '@/components/create-product-inline';
import { listFeatureFlags, listProducts, listEnvironments } from '@/lib/apiHandlers';
import { Suspense } from 'react';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string; envId?: string }>;
}) {
  const params = await searchParams;
  const productId = params.productId;
  const envId = params.envId;

  const [products, allEnvironments, features] = await Promise.all([
    listProducts(),
    listEnvironments(productId ? { productId } : {}),
    listFeatureFlags({ productId, envId }),
  ]);

  // For the environment selector, only show environments from the selected product
  const environments = productId ? allEnvironments : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your feature flag management</p>
        </div>
        <div className="flex items-center gap-4">
          <Suspense fallback={<div className="bg-muted h-10 w-[200px] animate-pulse rounded" />}>
            <ProductSelector products={products} />
          </Suspense>
          {productId && (
            <Suspense fallback={<div className="bg-muted h-10 w-[200px] animate-pulse rounded" />}>
              <EnvironmentSelector environments={environments} />
            </Suspense>
          )}
          {products.length === 0 && <CreateProductInline />}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="border-muted-foreground/25 flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
          <Flag className="text-muted-foreground/50 mb-4 h-12 w-12" />
          <h2 className="mb-2 text-xl font-semibold">No Products Yet</h2>
          <p className="text-muted-foreground mb-4">Get started by creating your first product</p>
          <CreateProductInline />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          <div className="md:sticky md:top-24 md:self-start">
            <StatsCard title="Total Features" value={features.length} icon={Flag} />
          </div>

          <div className="min-w-0">
            <FeaturesTable features={features} environments={allEnvironments} />
          </div>
        </div>
      )}
    </div>
  );
}
