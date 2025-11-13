// Note: Do NOT mark this entire file with 'use server'.
// This is a Server Component by default in Next.js App Router.
// Inline server actions inside <form action={...}> blocks will include 'use server'.

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { FeatureFlag, Environment } from '@/lib/adapters/types';

import { deleteFeature } from '@/app/actions/featureActions';

function truncateText(text: string | undefined, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function FeaturesTable({
  features,
  environments = [],
  allowDelete = false,
  actions
}: {
  features: FeatureFlag[];
  environments?: Environment[];
  allowDelete?: boolean;
  actions?: (f: FeatureFlag) => React.ReactNode;
}) {
  const envMap = new Map(environments.map(e => [e.id, e]));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Features</CardTitle>
        <CardDescription>List of all feature flags</CardDescription>
      </CardHeader>
      <CardContent>
        {features.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">No features yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[1%]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature) => {
                const env = envMap.get(feature.envId);
                return (
                  <TableRow key={feature.id} className="transition-colors hover:bg-muted">
                    <TableCell className="font-medium">{feature.label}</TableCell>
                    <TableCell className="text-muted-foreground">{env?.name ?? '-'}</TableCell>
                    <TableCell className="text-muted-foreground">{truncateText(feature.description, 50)}</TableCell>
                    <TableCell>
                      <Badge variant={feature.enabled ? 'default' : 'secondary'}>{feature.enabled ? 'On' : 'Off'}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/features/${feature.id}`}>
                          <Button size="sm" variant="ghost">Edit</Button>
                        </Link>
                        {actions ? actions(feature) : null}
                        {allowDelete ? (
                          <form
                            action={async () => {
                              'use server';
                              await deleteFeature(feature.id);
                            }}
                          >
                            <Button size="sm" variant="ghost" type="submit" className="text-destructive">
                              Delete
                            </Button>
                          </form>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
