import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

/** Server-only: reads content from `process.cwd()` using paths in `keystatic.config.ts`. */
export const keystaticReader = createReader(process.cwd(), keystaticConfig);
