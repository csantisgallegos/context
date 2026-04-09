export function diffArrays(a: string[], b: string[]) {
  return {
    missing: a.filter(x => !b.includes(x)),
    extra: b.filter(x => !a.includes(x))
  };
}