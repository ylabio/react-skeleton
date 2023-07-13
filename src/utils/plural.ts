export type TPluralVariantKey = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';
export type TPluralVariantMap = Partial<Record<TPluralVariantKey, string>>;

/**
 * Плюрализация
 * Возвращает вариант с учётом правил множественного числа под указанную локаль
 * @param value Число, под которое выбирается вариант формы.
 * @param variants Варианты форм множественного числа.
 * @example plural(5, {one: 'товар', few: 'товара', many: 'товаров'})
 * @param [locale] Локаль (код языка)
 * @returns {String}
 */
export default function plural(value: number, variants: TPluralVariantMap = {}, locale = 'ru-RU') {
  // Получаем фурму кодовой строкой: 'zero', 'one', 'two', 'few', 'many', 'other'
  // В русском языке 3 формы: 'one', 'few', 'many', и 'other' для дробных
  // В английском 2 формы: 'one', 'other'
  const key = new Intl.PluralRules(locale).select(value);
  // Возвращаем вариант по ключу, если он есть
  return variants[key] || '';
}
