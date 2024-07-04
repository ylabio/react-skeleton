import { newToken } from '../token/utils.ts';
import { type Token } from '../token';
import { type Container } from './index.ts';

/**
 * Токен на контейнер DI.
 * Используется в DI, чтобы сервис мог получить в зависимость весь контейнер DI
 */
export const SERVICES = newToken<Container>('@react-skeleton/container');

/**
 * Токен на токен.
 * Используется в DI, чтобы сервис мог запросить и получить в зависимость токен по которому связан в контейнере DI
 * За передачу конкретного токена отвечает контейнер DI
 */
export const TOKEN = newToken<Token>('@react-skeleton/token');
