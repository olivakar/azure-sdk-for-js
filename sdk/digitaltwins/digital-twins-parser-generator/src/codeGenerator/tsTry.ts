// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TsCatch, TsFinally, TsScope } from "./internal";

export class TsTry extends TsScope {
  private _nestingScope: TsScope;
  constructor(nestingScope: TsScope) {
    super(`try`);

    this._nestingScope = nestingScope;
  }

  catch(text: string) {
    const tsCatch = new TsCatch(text, this._nestingScope);
    this._nestingScope.statement(tsCatch);
    return tsCatch;
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
