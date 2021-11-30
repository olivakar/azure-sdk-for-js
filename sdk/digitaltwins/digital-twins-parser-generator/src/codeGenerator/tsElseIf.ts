// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {TsElse, TsScope} from './internal';

export class TsElseIf extends TsScope {
  private _nestingScope: TsScope;

  constructor(text: string, nestingScope: TsScope) {
    super(` else if (${text})`, true);

    this._nestingScope = nestingScope;
  }

  elseIf(text: string) {
    const tsElseIf = new TsElseIf(text, this._nestingScope);

    this._nestingScope.statement(tsElseIf);
    return tsElseIf;
  }

  else() {
    const tsElse = new TsElse();
    this._nestingScope.statement(tsElse);
    return tsElse;
  }

  line(text: string): this {
    super.line(text);
    return this;
  }
}
