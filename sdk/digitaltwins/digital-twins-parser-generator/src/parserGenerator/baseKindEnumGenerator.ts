/* eslint-disable sort-imports */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {TsLibrary} from '../codeGenerator/tsLibrary';
import {TypeGenerator} from './typeGenerator';
import {NameFormatter} from './nameFormatter';
import {MaterialClassDigest} from './metamodelDigest';

export class BaseKindEnumGenerator implements TypeGenerator {
  private readonly _typeName : string;
  private readonly _baseName: string;
  private readonly _elementNames: string[] = [];

  constructor(baseType: string, materialClassesObject: {[code: string]: MaterialClassDigest}) {
    this._baseName = baseType;
    this._typeName = NameFormatter.formatNameAsEnum(baseType);
    Object.entries(materialClassesObject).forEach(
      ([key, value]) => {
        if (!value.abstract) {
          this._elementNames.push(key);
        }
      },
    );
    this._elementNames.push('REFERENCE');
  }
  generateType(parserLibrary: TsLibrary): void {
    const kindEnum = parserLibrary.enum({name: this._typeName, exports: true});

    for (const val of this._elementNames) {
      kindEnum.enum({name: val.toUpperCase()});
    }
  }
}
