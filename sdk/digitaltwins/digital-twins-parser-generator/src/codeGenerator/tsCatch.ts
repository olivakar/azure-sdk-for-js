// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {TsFinally, TsScope} from './internal';

export class TsCatch extends TsScope {
  private _nestingScope: TsScope;
  constructor(err: string, nestingScope: TsScope) {
    super(` catch (${err})`, true);

    this._nestingScope = nestingScope;
  }

  finally() {
    const tsFinally = new TsFinally();
    this._nestingScope.statement(tsFinally);
    return tsFinally;
  }

  line(text: string): this {
    super.line(text);
    return this;
  }
}
