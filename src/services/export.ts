import { default as api } from '@src/services/api';
import { default as navigation } from '@src/services/navigation';
import { default as ssr } from '@src/services/ssr';
import { default as spec } from '@src/services/spec';
import { default as store } from '@src/services/store';

export const services = {
  store,
  api,
  navigation,
  ssr,
  spec,
}