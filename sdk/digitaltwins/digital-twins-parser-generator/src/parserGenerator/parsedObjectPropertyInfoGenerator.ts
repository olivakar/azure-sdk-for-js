// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */

import {NameFormatter} from './nameFormatter';
import {TsLibrary} from '../codeGenerator';
import {TypeGenerator} from './typeGenerator';

export class ParsedObjectPropertyInfoGenerator implements TypeGenerator {
  private readonly _baseKindEnum: string;

  constructor(baseName: string) {
    this._baseKindEnum = NameFormatter.formatNameAsEnum(baseName);
  }
  generateType(parserLibrary: TsLibrary): void {
    this.generateCode(parserLibrary);
  }

  generateCode(parserLibrary: TsLibrary) {
    const parsedObjectInterface = parserLibrary.interface({name: 'ParsedObjectPropertyInfo', exports: true});
    parsedObjectInterface.import(`import {InDTMI} from '../parser';`);
    parsedObjectInterface.import(`import {${this._baseKindEnum}} from './internal'`);
    parsedObjectInterface.field({name: 'expectedKinds', type: `${this._baseKindEnum}[]`, optional: true});
    parsedObjectInterface.inline('./src/parserPartial/type/parsedObjectPropertyInfo.ts', 'fields');
  }
}
