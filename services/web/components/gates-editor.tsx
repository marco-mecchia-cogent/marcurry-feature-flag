'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';
import type { Gate } from '@/lib/adapters/types';

interface GatesEditorProps {
  initialGates: Gate[];
  onChange?: (gates: Gate[]) => void;
}

export function GatesEditor({ initialGates, onChange }: GatesEditorProps) {
  const [gates, setGates] = useState<Gate[]>(initialGates);

  const updateGates = (newGates: Gate[]) => {
    setGates(newGates);
    onChange?.(newGates);
  };

  const addAllGate = () => {
    const newGate: Gate = { type: 'all', enabled: true };
    updateGates([...gates, newGate]);
  };

  const addActorsGate = () => {
    const newGate: Gate = { type: 'actors', actorIds: [] };
    updateGates([...gates, newGate]);
  };

  const removeGate = (index: number) => {
    updateGates(gates.filter((_, i) => i !== index));
  };

  const updateAllGate = (index: number, enabled: boolean) => {
    const newGates = [...gates];
    const gate = newGates[index];
    if (gate.type === 'all') {
      gate.enabled = enabled;
      updateGates(newGates);
    }
  };

  const updateActorsGate = (index: number, actorIds: string) => {
    const newGates = [...gates];
    const gate = newGates[index];
    if (gate.type === 'actors') {
      gate.actorIds = actorIds.split(',').map(id => id.trim()).filter(id => id.length > 0);
      updateGates(newGates);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Gates</Label>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="outline" onClick={addAllGate}>
            <Plus className="h-4 w-4 mr-1" />
            All Gate
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={addActorsGate}>
            <Plus className="h-4 w-4 mr-1" />
            Actors Gate
          </Button>
        </div>
      </div>

      {gates.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              No gates configured. Add a gate to control feature access.
            </p>
          </CardContent>
        </Card>
      )}

      {gates.map((gate, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  {gate.type === 'all' ? 'All Gate' : 'Actors Gate'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {gate.type === 'all'
                    ? 'Enable or disable for all users'
                    : 'Specify actor IDs that can access this feature'}
                </CardDescription>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => removeGate(index)}
                className="text-destructive h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {gate.type === 'all' ? (
              <div className="flex items-center justify-between">
                <Label htmlFor={`gate-all-${index}`}>Enabled for all</Label>
                <Switch
                  id={`gate-all-${index}`}
                  checked={gate.enabled}
                  onCheckedChange={(checked) => updateAllGate(index, checked)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor={`gate-actors-${index}`}>Actor IDs (comma-separated)</Label>
                <Input
                  id={`gate-actors-${index}`}
                  placeholder="user-123, user-456, user-789"
                  defaultValue={gate.actorIds.join(', ')}
                  onChange={(e) => updateActorsGate(index, e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Current: {gate.actorIds.length} actor{gate.actorIds.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Hidden input to submit gates as JSON */}
      <input type="hidden" name="gates" value={JSON.stringify(gates)} />
    </div>
  );
}
