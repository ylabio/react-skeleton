declare module 'shallowequal';

declare module '*.html' {
  const value: string;
  export default value;
}

declare module 'merge-change' {
  interface MergeChange {
    patch<A>(first: A,...values: (A | Partial<A> | PartialRecursive<A>)[]): any;
    merge<A>(first: A,...values: (A | Partial<A> | PartialRecursive<A>)[]): any;
    update<A>(first: A, ...values: (A | Partial<A> | PartialRecursive<A>)[]): any;
  }
  const mc: MergeChange;
  export default mc;
}
