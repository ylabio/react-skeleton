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
    // Иммутабельное слияние объектов. Если есть изменениям, то возвращается новый объект (иммутабельость на всю глубину слияния)
    update<A>(first: A, ...values: Patch<A>[]): A;
  }

  const mc: MergeChange;
  export default mc;
}
