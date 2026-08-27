import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPresetDocument, normalizePreset } from '../src/preset-core.mjs';

const base = { marketplace: 'etsy', label: 'Etsy listing', width: 2000, height: 2000, mode: 'contain', background: '#ffffff', active: true };

test('normalizes and validates a preset', () => {
  assert.deepEqual(normalizePreset({ ...base, marketplace: ' Etsy ', background: '#FFFFFF' }), base);
});

test('rejects unsafe dimensions, modes, colors, and slugs', () => {
  for (const patch of [
    { width: 0 },
    { height: 10001 },
    { mode: 'stretch' },
    { background: 'white' },
    { marketplace: '../etsy' },
  ]) assert.throws(() => normalizePreset({ ...base, ...patch }));
});

test('exports active presets in deterministic order', () => {
  const result = buildPresetDocument([
    { ...base, marketplace: 'shopify', label: 'Shopify' },
    { ...base, active: false },
    { ...base, marketplace: 'amazon', label: 'Amazon' },
  ]);
  assert.deepEqual(result.presets.map((item) => item.marketplace), ['amazon', 'shopify']);
});

test('rejects duplicate active presets and empty exports', () => {
  assert.throws(() => buildPresetDocument([base, { ...base }]));
  assert.throws(() => buildPresetDocument([{ ...base, active: false }]));
});
