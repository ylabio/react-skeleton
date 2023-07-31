export type TArticleItem = {
  _id: string,
  title: string,
  madeIn: {
    _id: string,
    title: string
  },
  category: {
    _id: string,
    title: string
  }
}

export type TArticleParams = {
  search: {
    category: string
  }
}
