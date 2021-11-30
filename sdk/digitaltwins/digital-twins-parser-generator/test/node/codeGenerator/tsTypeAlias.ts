// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {CodeWriter, TsDeclarationType, TsTypeAliasParams} from './internal';
import {TsDeclaration} from './tsDeclaration';


export class TsTypeAlias extends TsDeclaration {
  private _typeAlias: string;

  constructor({name, typeToBeAliased, exports = false}: TsTypeAliasParams) {
    super({name: name, type: TsDeclarationType.TypeAlias, exports: exports});
    this._typeAlias = typeToBeAliased;
  }

  get name() {
    return this._name;
  }

  private get _decoratedName(): string {
    if (this._exports) {
      return `export type ${this._name}`;
    } else {
      return `type ${this._name}`;
    }
  }

  generateCode(codeWriter: CodeWriter) {
    super.generateCode(codeWriter);
    codeWriter.writeLine(`${this._decoratedName} = ${this._typeAlias}`);
  }
}
