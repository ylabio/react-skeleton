export type TCategoryItem = {
  _id: string,
  title: string,
  children?: TCategoryItem[]
}

export type TCategoriesState = {
  items: TCategoryItem[],
  roots: TCategoryItem[],
  wait: boolean,
  errors: any,
}

