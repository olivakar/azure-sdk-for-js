/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { LiteralType } from "./literalType";

export class StringLiteralType implements LiteralType {
  canBeNull(isOptional: boolean): boolean {
    return true;
  }
  getSingularType(isOptional: boolean): string {
    return "string";
  }
  getInitialValue(isOptional: boolean): string {
    return isOptional ? "undefined" : `''`;
  }
}
