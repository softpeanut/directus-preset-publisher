const MODES = new Set(['contain', 'cover']);
const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizePreset(item) {
  const preset = {
    marketplace: String(item.marketplace ?? '').trim().toLowerCase(),
    label: String(item.label ?? '').trim(),
    width: Number(item.width),
    height: Number(item.height),
    mode: String(item.mode ?? '').trim().toLowerCase(),
    background: String(item.background ?? '').trim().toLowerCase(),
    active: item.active === true || item.active === 1,
  };

  if (!SLUG.test(preset.marketplace)) throw new Error('marketplace must be a lowercase slug');
  if (!preset.label) throw new Error(`label is required for ${preset.marketplace}`);
  if (!Number.isInteger(preset.width) || preset.width < 1 || preset.width > 10000) {
    throw new Error(`width is invalid for ${preset.marketplace}`);
  }
  if (!Number.isInteger(preset.height) || preset.height < 1 || preset.height > 10000) {
    throw new Error(`height is invalid for ${preset.marketplace}`);
  }
  if (!MODES.has(preset.mode)) throw new Error(`mode is invalid for ${preset.marketplace}`);
  if (!HEX_COLOR.test(preset.background)) {
    throw new Error(`background is invalid for ${preset.marketplace}`);
  }
  return preset;
}

export function buildPresetDocument(items) {
  const active = items.filter((item) => item.active === true || item.active === 1).map(normalizePreset);
  active.sort((a, b) => a.marketplace.localeCompare(b.marketplace));
  const names = new Set();
  for (const preset of active) {
    if (names.has(preset.marketplace)) throw new Error(`duplicate marketplace: ${preset.marketplace}`);
    names.add(preset.marketplace);
  }
  if (active.length === 0) throw new Error('at least one active preset is required');
  return { presets: active };
}
