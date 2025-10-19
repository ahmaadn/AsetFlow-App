export const matches = (list: (string | RegExp)[], path: string): boolean => {
  return list.some((r) => {
    if (r instanceof RegExp) return r.test(path);
    if (r.endsWith('*')) {
      return path.startsWith(r.slice(0, -1));
    }
    return path === r;
  });
};
