import type { ExtractTokenTypePartial, Token } from '../token/types.ts';

export type { Configs } from './index.ts';

export type ConfigItem<T extends Token = Token> = {
  token: T,
  value: ExtractTokenTypePartial<T>
}
