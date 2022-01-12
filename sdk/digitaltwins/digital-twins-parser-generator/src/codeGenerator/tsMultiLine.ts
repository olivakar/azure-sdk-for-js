// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CodeWriter, TsLine, TsStatement } from "./internal";

export class TsMultiLine implements TsStatement {
  private _text?: string;
  private _statements: TsStatement[];

  constructor(text?: string) {
    this._text = text;
    this._statements = [];
  }

  line(text: string) {
    this._statements.push(new TsLine(text));
    return this;
  }

  generateCode(codeWriter: CodeWriter) {
    if (this._text !== undefined) {
      codeWriter.writeLine(this._text);
    }
    for (let i = 0; i < this._statements.length; i++) {
      this._statements[i].generateCode(codeWriter);
    }
  }
}
