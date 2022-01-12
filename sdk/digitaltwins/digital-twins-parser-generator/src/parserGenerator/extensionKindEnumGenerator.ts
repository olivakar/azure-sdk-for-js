// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { NameFormatter } from "./nameFormatter";
import { TsLibrary } from "../codeGenerator";
import { TypeGenerator } from "./typeGenerator";

export class ExtensionKindEnumGenerator implements TypeGenerator {
  private readonly _extensionKinds: string[];

  constructor(extensionKinds: string[]) {
    this._extensionKinds = extensionKinds;
  }
  generateType(parserLibrary: TsLibrary): void {
    this.generateCode(parserLibrary);
  }

  generateCode(parserLibrary: TsLibrary) {
    const tsEnum = parserLibrary.enum({
      name: NameFormatter.formatNameAsEnum("Extension"),
      exports: true
    });
    for (const extensionKind of this._extensionKinds) {
      tsEnum.enum({ name: NameFormatter.formatNameAsEnumValue(extensionKind) });
    }
  }
}
