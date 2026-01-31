import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/**
 * Loads optional user config from project root (config.js).
 * Supports:
 *  - CommonJS: module.exports = {...}
 *  - ESM: export default {...} (loaded via dynamic import)
 *
 * Returns merged config object.
 */
export async function loadUserConfig(baseConfig, sectionName) {
  const configPath = path.resolve(process.cwd(), 'config.js');
  if (!fs.existsSync(configPath)) return baseConfig;

  let userConfig;
  try {
    // Prefer sync-friendly CJS require
    userConfig = require(configPath);
    // CJS may export default-like shape
    userConfig = userConfig?.default ?? userConfig;
  } catch (err) {
    // Fallback to ESM dynamic import
    try {
      const mod = await import(pathToFileURL(configPath).href);
      userConfig = mod?.default ?? mod;
    } catch (err2) {
      return baseConfig;
    }
  }

  if (!userConfig || typeof userConfig !== 'object') return baseConfig;

  const section = userConfig[sectionName];
  if (!section || typeof section !== 'object') return baseConfig;

  return { ...baseConfig, ...section };
}
