export type DefaultParams = {
  limit: number,
  page: number,
  sort: string,
  fields: string,
  search: Record<string, string | number | boolean | null>
}

export type TListParamsState<Item, Params = never> = {
  items: Item[],
  count: number,
  params: DefaultParams | Params
  wait: boolean,
  errors: any,
}
