import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Trash2 } from 'lucide-react';
import { EnvironmentsTable, type EnvironmentRow } from '@/components/environments-table';
import { CreateEnvironmentInline } from '@/components/create-environment-inline';
import { getProductById, listEnvironments, listFeatureFlags } from '@/lib/apiHandlers';
import { deleteProductAction, updateProductAction } from '@/app/actions/productActions';
import Link from 'next/link';

export default async function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const product = await getProductById(productId);
  if (!product) return notFound();

  const envs = await listEnvironments({ productId });
  const rows: EnvironmentRow[] = await Promise.all(
    envs.map(async (env) => {
      const features = await listFeatureFlags({ productId, envId: env.id });
      return { environment: env, featureCount: features.length } satisfies EnvironmentRow;
    })
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product</h1>
          <p className="text-muted-foreground mt-1">Manage environments and settings</p>
        </div>
        <CreateEnvironmentInline productId={product.id} />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateProductAction} className="max-w-xl space-y-4">
            <input type="hidden" name="id" value={product.id} />
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={product.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={product.description ?? ''} />
            </div>
            <Button type="submit"><Save className="mr-1 h-4 w-4" />Save</Button>
          </form>
          <div className="mt-4">
            <form
              action={async () => {
                'use server';
                await deleteProductAction(product.id);
              }}
            >
              <Button type="submit" variant="destructive">
                <Trash2 className="mr-1 h-4 w-4" />Delete Product
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/products" className="hover:underline">Products</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <EnvironmentsTable items={rows} />
    </div>
  );
}
