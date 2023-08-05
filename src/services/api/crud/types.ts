export interface BaseQuery {
  fields?: string;
}

export interface FindQuery extends BaseQuery{
  filter?: object,
  limit?: number;
  skip?: number;
  sort?: string
}

export interface GetQuery extends BaseQuery{
  id: string
}

export interface DataQuery extends BaseQuery{
  id?: string,
  data: any
}
