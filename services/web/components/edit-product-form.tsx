'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Trash2 } from 'lucide-react';
import { deleteProductAction, updateProductAction } from '@/app/actions/productActions';
import { useToast } from '@/components/ui/toast';
import type { Product } from '@/lib/db/types';

export function EditProductForm({ product }: { product: Product }) {
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  async function handleUpdate(formData: FormData) {
    setSubmitting(true);
    try {
      await updateProductAction(formData);
      showToast('Product updated successfully');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteProductAction(product.id);
      showToast('Product deleted successfully');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <form action={handleUpdate} className="max-w-xl space-y-4">
        <input type="hidden" name="id" value={product.id} />
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={product.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" defaultValue={product.description ?? ''} />
        </div>
        <Button type="submit" disabled={submitting}>
          <Save className="mr-1 h-4 w-4" />
          {submitting ? 'Saving...' : 'Save'}
        </Button>
      </form>
      <div className="mt-4">
        <form action={handleDelete}>
          <Button type="submit" variant="destructive" disabled={deleting}>
            <Trash2 className="mr-1 h-4 w-4" />
            {deleting ? 'Deleting...' : 'Delete Product'}
          </Button>
        </form>
      </div>
    </>
  );
}
