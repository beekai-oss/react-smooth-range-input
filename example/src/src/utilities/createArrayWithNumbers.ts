export default function createArrayWithNumbers(length: number): Array<number> {
  return Array.from({ length }, (_, k) => k + 1);
}
