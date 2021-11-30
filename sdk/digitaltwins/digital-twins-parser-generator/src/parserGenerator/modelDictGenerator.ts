// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */

import {NameFormatter} from './nameFormatter';
import {TsLibrary} from '../codeGenerator';
import {TypeGenerator} from './typeGenerator';

export class ModelDictGenerator implements TypeGenerator {
  private _baseClassName: string;

  constructor(baseName: string) {
    this._baseClassName = NameFormatter.formatNameAsInterface(baseName);
  }
  generateType(parserLibrary: TsLibrary): void {
    this.generateCode(parserLibrary);
  }

  generateCode(parserLibrary: TsLibrary): void {
    const modelDictType = parserLibrary.typeAlias({name: 'ModelDict', typeToBeAliased: `{[id: string]: ${this._baseClassName}|undefined}`, exports: true});
    modelDictType.import(`import {${this._baseClassName}} from './internal';`);
  }
}
