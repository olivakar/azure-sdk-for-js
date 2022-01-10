export const getTestcase = function (testCaseFolder: string, filename: string): string {
  const data = (window as any)["__json__"][filename];
  return data
}
