/**
 * Генератор чисел с шагом 1
 */
export default function codeGenerator(start = 0) {
  return () => ++start;
}
