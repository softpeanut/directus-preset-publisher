import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { readItems } from '@directus/sdk';
import { buildPresetDocument } from '../src/preset-core.mjs';
import { createAdminClient } from './client.mjs';

const output = resolve(process.argv[2] ?? 'dist/presets.json');
const client = await createAdminClient();
const items = await client.request(readItems('marketplace_presets', {
  fields: ['marketplace', 'label', 'width', 'height', 'mode', 'background', 'active'],
  limit: -1,
}));
const document = buildPresetDocument(items);
await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(document, null, 2)}\n`, { flag: 'wx' });
console.log(`exported ${document.presets.length} presets to ${output}`);
