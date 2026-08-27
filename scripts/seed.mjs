import { createCollection, createField, createItems, readCollections } from '@directus/sdk';
import { createAdminClient } from './client.mjs';

const collection = 'marketplace_presets';
const presets = [
  { marketplace: 'amazon', label: 'Amazon main', width: 1600, height: 1600, mode: 'contain', background: '#ffffff', active: true },
  { marketplace: 'etsy', label: 'Etsy listing', width: 2000, height: 2000, mode: 'contain', background: '#ffffff', active: true },
  { marketplace: 'instagram', label: 'Instagram portrait', width: 1080, height: 1350, mode: 'cover', background: '#ffffff', active: true },
  { marketplace: 'shopify', label: 'Shopify product', width: 2048, height: 2048, mode: 'contain', background: '#ffffff', active: true },
];

const fields = [
  ['marketplace', 'string', { is_nullable: false, is_unique: true }, { interface: 'input', required: true }],
  ['label', 'string', { is_nullable: false }, { interface: 'input', required: true }],
  ['width', 'integer', { is_nullable: false }, { interface: 'input', required: true }],
  ['height', 'integer', { is_nullable: false }, { interface: 'input', required: true }],
  ['mode', 'string', { is_nullable: false, default_value: 'contain' }, { interface: 'select-dropdown', required: true, options: { choices: [{ text: 'Contain', value: 'contain' }, { text: 'Cover', value: 'cover' }] } }],
  ['background', 'string', { is_nullable: false, default_value: '#ffffff' }, { interface: 'input', required: true }],
  ['active', 'boolean', { is_nullable: false, default_value: true }, { interface: 'boolean', required: true }],
];

const client = await createAdminClient();
const existing = await client.request(readCollections());
if (existing.some((entry) => entry.collection === collection)) {
  console.log(`${collection} already exists; seed skipped`);
  process.exit(0);
}

await client.request(createCollection({ collection, meta: { icon: 'photo_size_select_large' }, schema: {} }));
for (const [field, type, schema, meta] of fields) {
  await client.request(createField(collection, { field, type, schema, meta }));
}
await client.request(createItems(collection, presets));
console.log(`created ${collection} with ${presets.length} presets`);
