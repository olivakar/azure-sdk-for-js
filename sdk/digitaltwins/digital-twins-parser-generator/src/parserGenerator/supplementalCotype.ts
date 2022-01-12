// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { NameFormatter } from "./nameFormatter";
import { TsScope } from "../codeGenerator";

export class SupplementalCotype {
  private _kindValue: string;

  constructor(cotype: string, kindEnum: string) {
    this._kindValue = `'${NameFormatter.formatNameAsKindString(cotype)}'`;
  }

  addCotype(scope: TsScope, infoVariableName: string): void {
    scope.line(`${infoVariableName}.addCotype(${this._kindValue})`);
  }
}
