/* eslint-disable sort-imports */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {TsScope} from '../../codeGenerator';
import {Context} from '../metamodelDigest';
import {NameFormatter} from '../nameFormatter';
import {ParserGeneratorValues} from '../parserGeneratorValues';

export class ConcreteSubclass {
  private _dtdlVersion: number;
  private _rawSubTypeName: string;
  private _subClassTypeName: string;
  private _kindValue: string;
  private _subClassUri: string;
  private _maxLength?: number;
  private _pattern?: string;

  constructor(dtdlVersion:number, rawSubTypeName: string, kindEnum: string, dtdlContexts : {[contextId: string]: Context}, identifierRestrictionsToken?: any) {
    this._dtdlVersion = dtdlVersion;
    this._rawSubTypeName = rawSubTypeName;
    this._subClassTypeName = NameFormatter.formatNameAsImplementation(rawSubTypeName);
    this._kindValue = NameFormatter.formatNameAsKindString(rawSubTypeName);
    this._subClassUri = dtdlContexts[ParserGeneratorValues.getDtdlContextIdString(dtdlVersion)][rawSubTypeName];
    if (Object.prototype.hasOwnProperty.call(identifierRestrictionsToken, rawSubTypeName) ) {
      const idRestriction = identifierRestrictionsToken[rawSubTypeName];
      if (Object.prototype.hasOwnProperty.call(idRestriction, dtdlVersion)) {
        this._maxLength = idRestriction[dtdlVersion].maxLength;
        this._pattern = idRestriction[dtdlVersion].pattern;
      } else {
        this._maxLength = undefined;
        this._pattern = undefined;
      }
    }
  }

  get className() : string {
    return this._subClassTypeName;
  }

  get rawSubTypeName() : string {
    return this._rawSubTypeName;
  }

  get subClassUri() : string {
    return this._subClassUri;
  }

  public addCaseToParseTypeStringSwitch(methodScope:TsScope, elementInfoStr:string, elementIdStr:string, parentIdStr:string, definedInStr:string) : void {
    methodScope
      .line(`case '${this.rawSubTypeName}':`)
      .line(`case '${this.subClassUri}':`);

    if (this._maxLength !== undefined) {
      methodScope
        .if(`elementId.length > ${this._maxLength}`)
          .line('parsingErrors.push(createParsingError(')
          .line(`'dtmi:dtdl:parsingError:idTooLongFor${this.rawSubTypeName}',`)
          .line('{')
          .line(`cause: 'Identifier \\'{{{{primaryId}}}}\\' is too long for an element with @type ${this.rawSubTypeName} -- length limit for this type is ${this._maxLength}.',`)
          .line(`action: 'Select a shorter value for the identifier or trim current value to fewer than ${this._maxLength} characters.',`)
          .line(`primaryId: elementId,`)
          .line(`property: '@id',`)
          .line(`}));`);
    }
    if (this._pattern !== undefined) {
      methodScope
        .if(`!${this.className}.${this.rawSubTypeName}{RegexPatternFieldSuffix}${this._dtdlVersion}.IsMatch(elementId.absolutePath)`)
          .line('parsingErrors.push(createParsingError(')
          .line(`'dtmi:dtdl:parsingError:invalidIdFor${this.rawSubTypeName}',`)
          .line('{')
          .line(`cause: 'Identifier \\'{{{{primaryId}}}}\\' is invalid for an element with @type ${this.rawSubTypeName}.',`)
          .line(`action: 'Replace the identifier with a string that conforms to the DTMI syntax allowed for elements of type ${this.rawSubTypeName} -- see https://aka.ms/dtdl.',`)
          .line(`primaryId: elementId,`)
          .line(`property: '@id',`)
          .line(`}));`);
    }
    methodScope
      .line(`${elementInfoStr} = new ${this.className}(${this._dtdlVersion}, ${elementIdStr}, ${parentIdStr}, ${definedInStr},'${this._kindValue}');`)
      // .line(`materialKinds.push(${this._kindValue});`)
      // TODO Should enum value be always lower case
      .line(`materialKinds.push('${this._kindValue}');`)
      .line('return true;');
  }


  public addEnumValue(staticInitScope:TsScope, varname:string) : void {
    staticInitScope.line(`${varname}.push('${this._kindValue}');`);
  }
}
