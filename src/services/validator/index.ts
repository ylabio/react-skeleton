import Ajv, {SchemaObject} from "ajv";
import {TServices} from "@src/services/types";
import Service from "@src/services/service";

/**
 * Сервис для валидации по схеме
 */
class ValidatorService extends Service<unknown, undefined>{
  private ajv: Ajv;

  constructor(config: unknown, services: TServices, env: ImportMetaEnv) {
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
   * @param schema JSONSchema
   */
  make(schema: SchemaObject){
    return this.ajv.compile(schema);
  }
}

export default ValidatorService;
