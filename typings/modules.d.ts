declare module 'shallowequal';

declare module '*.html' {
  const value: string;
  export default value;
}

declare module 'merge-change' {
  interface MergeChange {
    patch<A>(first: A,...values: (A | PartialRecursive<A>)[]): A;
    merge<A>(first: A,...values: (A | PartialRecursive<A>)[]): A;
    update<A>(first: A, ...values: (A | PartialRecursive<A>)[]): A;
  }
  const mc: MergeChange;
  export default mc;
}
