import {useSyncExternalStore} from "react";
import useServices from "@src/services/use-services";
import {TLocaleReal, TTranslationKey, useI18nReturn} from "@src/features/i18n/types";

/**
 * Хук возвращает функцию для локализации текстов, текущую локали, доступные локали и функцию смены локали.
 * Отслеживает изменения локали или словаря для перерендера компонента
 */
export default function useI18n(): useI18nReturn {
  const i18n = useServices().i18n;
  const state = useSyncExternalStore(i18n.subscribe, i18n.getState, i18n.getState);
  return {
    // Текущая локаль
    locale: state.locale,
    // Доступные локали
    locales: state.locales,
    // Функция для смены локали
    setLocale: (locale: TLocaleReal) => i18n.setLocale(locale),
    // Функция для локализации текстов
    t: (key: TTranslationKey, options?) => i18n.translate(key, options),
    // Форматирования числа с учётом локали
    n: (value: number, options?) => i18n.number(value, options),
  };
}

export function useTranslate() {
  return useI18n().t;
}
