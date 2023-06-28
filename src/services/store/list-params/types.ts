export interface InitListParamsStateType {
  items: any[],
  count: number,
  params: {
    limit: number,
    page: number,
    sort: string,
    fields: string,
    filter: object,
  },
  wait: false,
  errors: null,
}
