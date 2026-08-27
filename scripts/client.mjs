import { authentication, createDirectus, rest } from '@directus/sdk';

export function getConfig() {
  const url = process.env.DIRECTUS_URL ?? 'http://127.0.0.1:8055';
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
  return { url, email, password };
}

export async function createAdminClient() {
  const { url, email, password } = getConfig();
  const client = createDirectus(url).with(authentication('json', { autoRefresh: false })).with(rest());
  await client.login({ email, password });
  return client;
}
