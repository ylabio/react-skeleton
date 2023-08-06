declare module 'shallowequal';

declare module '*.html' {
  const value: string;
  export default value;
}

declare module 'merge-change' {
  interface MergeChange {
    // Патч первого объекта с его мутацией
    patch<A>(first: A, ...values: Patch<A>[]): A;
    // Создание нового объекта на основе первого слиянием в глубину остальных
    merge<A>(first: A, ...values: Patch<A>[]): A;
    // Создание нового объекта, если есть изменениям после слиянием в глубину остальных объектов
    update<A>(first: A, ...values: Patch<A>[]): A;
  }

  const mc: MergeChange;
  export default mc;
}
