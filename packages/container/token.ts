import { newToken } from '../token/utils.ts';
import type { Container } from './types.ts';

/**
 * Токен на контейнер DI.
 * Используется в DI, чтобы сервис мог получить в зависимость весь контейнер DI
 */
export const CONTAINER = newToken<Container>('@react-skeleton/container');
