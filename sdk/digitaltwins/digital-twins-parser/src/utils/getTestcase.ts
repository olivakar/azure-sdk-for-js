import * as fs from 'fs'

export const getTestcase = function (filename: string): string {
  const data = fs.readFileSync(filename, "utf-8");
  return data
}
