export default function roundRange(value: number, min: number, max: number):number {
  return Math.max(min, Math.min(max, value));
}
