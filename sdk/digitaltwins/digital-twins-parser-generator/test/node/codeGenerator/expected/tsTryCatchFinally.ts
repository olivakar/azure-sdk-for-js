/* eslint-disable */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

export class testClass {
  constructor() {}

  trySomething(input: any) {
    try {
      console.log(`${input.foo}`);
    } catch (e) {
      console.log(e);
    } finally {
      console.log("in finally block");
    }
  }
}
