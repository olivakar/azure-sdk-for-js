export const getFilenames = function (_testCaseFolder: string): string[] {  
  const filenames = Object.keys((window as any)["__json__"])
  return filenames
}
