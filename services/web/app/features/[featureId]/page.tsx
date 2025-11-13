import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Save, Trash2 } from 'lucide-react';
import { GatesEditor } from '@/components/gates-editor';
import { getFeatureFlagById, getProductById, getEnvironmentById } from '@/lib/apiHandlers';
import { deleteFeature, updateFeature } from '@/app/actions/featureActions';

export default async function FeatureDetailPage({ params }: { params: Promise<{ featureId: string }> }) {
  const { featureId } = await params;
  const feature = await getFeatureFlagById(featureId);
  if (!feature) return notFound();

  const [product, environment] = await Promise.all([
    getProductById(feature.productId),
    getEnvironmentById(feature.envId)
  ]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/products" className="hover:underline">Products</Link>
        <span>/</span>
        {product && (
          <>
            <Link href={`/products/${product.id}`} className="hover:underline">{product.name}</Link>
            <span>/</span>
          </>
        )}
        {environment && (
          <>
            <Link href={`/products/${feature.productId}/environments/${feature.envId}`} className="hover:underline">
              {environment.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span>{feature.label}</span>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Feature</h1>
        <p className="text-muted-foreground mt-1">Edit feature flag settings</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Edit Feature</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateFeature} className="max-w-xl space-y-4">
            <input type="hidden" name="id" value={feature.id} />

            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input id="label" name="label" defaultValue={feature.label} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={feature.description ?? ''} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="enabled">Enabled</Label>
              <Switch id="enabled" name="enabled" defaultChecked={feature.enabled} />
            </div>

            <GatesEditor initialGates={feature.gates || []} />

            <Button type="submit"><Save className="mr-1 h-4 w-4" />Save</Button>
          </form>

          <div className="mt-4">
            <form
              action={async () => {
                'use server';
                await deleteFeature(feature.id);
              }}
            >
              <Button type="submit" variant="destructive">
                <Trash2 className="mr-1 h-4 w-4" />Delete Feature
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
