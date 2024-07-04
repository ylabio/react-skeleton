import type { ExtractTokenTypePartial, Token } from '../token/types.ts';
import type { ConfigItem } from './types.ts';

/**
 * Создание пары Токен/Настройки
 * Используется для общего конфигурирования сервисов, для переопределения настроек заданных по умолчанию
 * Функция вспомогательная для типизации настроек соответствующих указанному токену.
 * @param token Токен
 * @param value Значение сопоставимое с типом токена в опциональном варианте
 */
export function config<T extends Token, C extends ExtractTokenTypePartial<T>>(token: T, value: C): ConfigItem<T> {
  return {
    token,
    value
  };
}
