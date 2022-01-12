// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CodeWriter, TsMultiLine } from "./internal";

export class TsMultiLineDocString extends TsMultiLine {
  constructor() {
    super("/**");
  }

  line(text: string) {
    super.line(` * ${text}`);
    return this;
  }

  generateCode(codeWriter: CodeWriter) {
    super.line("**/");
    super.generateCode(codeWriter);
  }
}
