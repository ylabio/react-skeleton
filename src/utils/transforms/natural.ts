/**
 * Натуральное число (целое от 1)
 * @param value
 */
export default function natural(value: number) {
  let result = Number(value);
  if (Number.isNaN(result)) {
    return 1;
  } else {
    return Math.max(1, value);
  }
}
