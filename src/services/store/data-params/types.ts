export interface DefaultConfig {
  // Запоминать параметры
  rememberParams: boolean;
}

export interface DefaultParams {
  // Количество элементов на страницу
  limit: number,
  // Номер страницы
  page: number,
  // Сортировка
  sort: string,
  // Поисковый запрос (фильтр по строке)
  query: string
}

export type TDataParamsState<Data, Params> = {
  data: Data,
  // Параметры выборки списка элементов
  params: Params
  // Ожидание выборки списка элементов (из АПИ)
  wait: boolean,
  // Ошибки выборки списка элементов (из АПИ)
  errors: any,
}

export type SetParamsOptions = {
  // Способ изменения адреса браузера, если параметры сохраняются в url search (push/replace)
  push?: boolean,
  // Загружать данные по новым параметрам
  load?: boolean
  // Сбросить текущие данные
  clear?: boolean
}
