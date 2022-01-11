// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as fs from 'fs';

const relativeDirectory = './test/node/codeGenerator/expected';

export function processExpectedOutputFile(fileName: string) {
  const data = fs.readFileSync(`${relativeDirectory}/${fileName}`, 'utf-8');
  // given the data in utf-8 format, we break it up based on carriage return line endings,
  // and then trim the leading and ending whitespaces.
  // it also removes the first line of the file, which should be an eslint disable comment.
  return data.split(/\n/).map((line) => line.trim()).slice(1);
}
