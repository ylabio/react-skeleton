import Ajv from "ajv";

/**
 * Сервис спецификаций
 * На текущий момент инкассирует настройку библиотеки ajv для валидации по JSONSchema
 */
class SpecService {
  services: any;
  config: any;
  ajv!: Ajv;

  async init(config: any, services: any) {
    this.services = services;
    this.config = config;
    this.ajv = new Ajv({
      //strict: false,
      removeAdditional: true, // Если в схеме явно указано additionalProperties: false, то удалять все не описанные свойства,
      useDefaults: true, // Установка значения по умолчанию из default если свойства нет или оно null или undefined
      coerceTypes: true, // Корректировка скалярных типов по схеме. Например строку в число.
      messages: true, // Сообщения об ошибках
      allErrors: true, // Искать все ошибки вместо остановки при первой найденной
      verbose: true, // Передача текущей схемы в callback кастомного ключевого слова
      passContext: true, // Передача своего контекста в callback кастомного ключевого слова при валидации
    });
    return this;
  }

  /**
   * Создание функции валидации по переданной JSONSchema
   * @param schema {Object} JSONSchema
   * @return {Function}
   */
  createValidator(schema: any){
    return this.ajv.compile(schema);
  }
}

export default SpecService;
