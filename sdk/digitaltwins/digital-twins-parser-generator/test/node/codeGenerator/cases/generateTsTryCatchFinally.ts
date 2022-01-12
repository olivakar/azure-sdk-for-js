// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TsLibrary } from "../../../../src/codeGenerator";
import { testCaseType } from "./common/testCaseType";

const tsTryCatchFinallyTestCases: Array<(outputDir: string) => testCaseType> = [
  function createSimpleClass(outputDir: string): testCaseType {
    const tsLibrary = new TsLibrary(outputDir);
    const tsClass = tsLibrary.class({ name: "testClass", exports: true });
    tsClass.ctor.body;
    const trySomethingMethod = tsClass
      .method({ name: "trySomething" })
      .parameter({ name: "input", type: "any" }).body;
    trySomethingMethod
      .try()
      .line("console.log(`${input.foo}`);")
      .catch("e")
      .line("console.log(e);")
      .finally()
      .line("console.log('in finally block');");

    return {
      name: "try catch finally block",
      codeGenerator: tsLibrary,
      fileName: "tsTryCatchFinally.ts"
    };
  }
];

export const tsTryCatchFinallyCase = {
  unitUnderTest: "TsTryCatchFinally",
  testCases: tsTryCatchFinallyTestCases
};
