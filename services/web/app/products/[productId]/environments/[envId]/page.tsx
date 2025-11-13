import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FeaturesTable } from '@/components/feature-usage-table';
import { CreateFeatureInline } from '@/components/create-feature-inline';
import { getEnvironmentById, getProductById, listFeatureFlags } from '@/lib/apiHandlers';
import { deleteEnvironmentAction, updateEnvironmentAction } from '@/app/actions/environmentActions';

export default async function EnvironmentDetailPage({ params }: { params: Promise<{ productId: string; envId: string }> }) {
  const { productId, envId } = await params;
  const [product, environment] = await Promise.all([getProductById(productId), getEnvironmentById(envId)]);
  if (!product || !environment || environment.productId !== product.id) return notFound();

  const features = await listFeatureFlags({ productId, envId });

  return (
    <div className="container mx-auto py-8">
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/products" className="hover:underline">Products</Link>
        <span>/</span>
        <Link href={`/products/${product.id}`} className="hover:underline">{product.name}</Link>
        <span>/</span>
        <span>{environment.name}</span>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Environment</h1>
          <p className="text-muted-foreground mt-1">Manage features in this environment</p>
        </div>
        <CreateFeatureInline productId={productId} envId={envId} />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Edit Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateEnvironmentAction} className="max-w-xl space-y-4">
            <input type="hidden" name="id" value={environment.id} />
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={environment.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={environment.description ?? ''} />
            </div>
            <Button type="submit">Save</Button>
          </form>
          <div className="mt-4">
            <form
              action={async () => {
                'use server';
                await deleteEnvironmentAction(environment.id);
              }}
            >
              <Button type="submit" variant="destructive">
                Delete Environment
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <FeaturesTable features={features} allowDelete />
    </div>
  );
}
