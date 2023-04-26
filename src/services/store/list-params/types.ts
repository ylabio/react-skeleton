export interface InitListParamsStateType {
  items: any[],
  count: number,
  params: {
    limit: number,
    page: number,
    sort: { date: 'asc' |  'desc'},
    fields: string,
    filter: object,
  },
  wait: false,
  errors: null,
}
