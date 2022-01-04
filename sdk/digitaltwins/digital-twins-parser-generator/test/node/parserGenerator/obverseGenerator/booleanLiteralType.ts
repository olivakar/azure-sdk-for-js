/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {LiteralType} from './literalType';

export class BooleanLiteralType implements LiteralType {
  canBeNull(isOptional: boolean): boolean {
    return false;
  }
  getSingularType(isOptional: boolean): string {
    return 'boolean';
  }
  getInitialValue(isOptional: boolean): string {
    return 'false';
  }
}
