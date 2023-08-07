export default function randomItem<A>(items: A[]):A {
  return items[Math.floor(Math.random() * items.length)];
}
