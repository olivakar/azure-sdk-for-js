// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CodeWriter,
  TsScope,
} from './internal';

export class TsForEach extends TsScope {
  constructor(text: string, parameters: string) {
    super(`${text}.forEach((${parameters}) => `);
  }

  generateCode(codeWriter: CodeWriter) {
    if (this._firstLine) {
      codeWriter.writeLine(`${this._firstLine} `, true, this._suppressBreak);
    }
    codeWriter.openScope();
    for (let i=0; i<this._inlines.length; i++) {
      const inlineBlock = this._inlines[i];
      inlineBlock.generateCode(codeWriter);
    }
    for (let i=0; i<this._statements.length; i++) {
      const statement = this._statements[i];
      statement.generateCode(codeWriter);
    }
    codeWriter.writeLine(`});`);
  }
}
