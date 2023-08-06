import Ajv, {JSONSchemaType, ValidateFunction} from "ajv";
import {TServices} from "@src/services/types";
import Service from "@src/services/service";

/**
 * Сервис для валидации по схеме
 */
class ValidatorService extends Service{
  private ajv: Ajv;

  constructor(config: object, services: TServices, env: ImportMetaEnv) {
    super(config, services, env);
    this.ajv = new Ajv({
      //strict: false,
      removeAdditional: true, // Если в схеме явно указано additionalProperties: false, то удалять все не описанные свойства,
      useDefaults: true, // Установка значения по умолчанию из default если свойства нет или оно null, или undefined.
      coerceTypes: true, // Корректировка скалярных типов по схеме. Например, строку в число.
      messages: true, // Сообщения об ошибках
      allErrors: true, // Искать все ошибки вместо остановки при первой найденной
      verbose: true, // Передача текущей схемы в callback кастомного ключевого слова
      passContext: true, // Передача своего контекста в callback кастомного ключевого слова при валидации
    });
  }

  /**
   * Создание функции валидации по JSONSchema
   * @param schema JSON схема
   */
  make<T>(schema: JSONSchemaType<T>): ValidateFunction<T>{
    return this.ajv.compile(schema);
  }
}

export default ValidatorService;

