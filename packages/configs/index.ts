import mc from 'merge-change';
import path from 'node:path';
import { fileURLToPath } from 'url';
import type { ExtractTokenTypePartial, Token } from '../token/types.ts';
import type { ConfigItem } from './types.ts';

export class Configs {
  private data: Map<symbol, any> = new Map();

  constructor(protected depends: {
    env: ImportMetaEnv
  }) {}

  async init() {
    if (process && typeof process.cwd === 'function') {
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const fileName = path.resolve(process.cwd(), './server/config.ts');
      const relative = './' + path.relative(__dirname, fileName);
      const configModule = await import(relative);
      const configItems = configModule.default(this.depends.env) as ConfigItem[];
      for (const item of configItems) {
        this.data.set(item.token.symbol, item.value);
      }
    }
  }

  get<T extends Token, D extends ExtractTokenTypePartial<T> | undefined>(token: T, defaultData?: D): ExtractTokenTypePartial<T> & D {
    const value = this.data.get(token.symbol);
    return mc.merge(defaultData, value) as ExtractTokenTypePartial<T> & D;
  }

  set<T extends Token>(token: T, data: ExtractTokenTypePartial<T>): void {
    this.data.set(token.symbol, data);
  }
}
