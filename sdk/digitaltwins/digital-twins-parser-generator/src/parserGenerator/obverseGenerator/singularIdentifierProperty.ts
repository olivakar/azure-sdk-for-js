/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {TsClass, TsScope} from '../../codeGenerator';
import {ParserGeneratorValues} from '../parserGeneratorValues';
import {IdentifierProperty} from './identifierProperty';
import {PropertyRepresentation} from './propertyRepresentation';

export class SingularIdentifierProperty extends IdentifierProperty {
  public iterate(outerScope: TsScope, varName: {ref: string}): TsScope {
    varName.ref = `this.${this.propertyName}`;

    if (this.propertyDigest._.optional) {
      return outerScope.if(`this.${this.propertyName} !== undefined`);
    } else {
      return outerScope;
    }
  }

  public checkPresence(outerScope: TsScope): TsScope {
    if (this.propertyDigest._.optional) {
      return outerScope.if(`this.${this.propertyName} !== undefined`);
    } else {
      return outerScope;
    }
  }

  public get propertyRepresentation(): PropertyRepresentation {
    return this.optional ? PropertyRepresentation.NullableItem : PropertyRepresentation.Item;
  }
  public get propertyType(): string | undefined {
    return 'string';
  }
  // public get propertyImplType(): string | undefined {
  //   throw new Error('Method not implemented.');
  // }

  public generateConstructorCode(obverseClass: TsClass, ctorScope: TsScope): void {
    // NOTE for Node : any SINGULAR IDENTIFIER types are never initialized inside a Constructor.
  }

  public addCaseToParseSwitch(dtdlVersion: number, obverseClass: TsClass, switchScope: TsScope, classIsAugmentable: boolean, classIsPartition: boolean, valueCountVar: string, definedInVar: string): void {
    if (Object.prototype.hasOwnProperty.call(this.propertyDigest, dtdlVersion) && this.propertyDigest[dtdlVersion].allowed) {
      const maxLenStr = this.propertyDigest[dtdlVersion].maxLength?.toString();
      const patternStr = this.propertyDigest[dtdlVersion].pattern? `this.${this.propertyName}PropertyRegexPatternV${dtdlVersion}` : undefined;

      switchScope
        .line(`case '${this.propertyName}':`)
        .line(`case '${this.propertyNameUris[dtdlVersion]}':`);
      if (!this.optional) {
        switchScope.line(`${this.missingPropertyVariable} = false;`);
      }

      switchScope
        .line('// eslint-disable-next-line no-case-declarations')
        .line(`const strInDtmiVal = ValueParser.parseSingularIdentifierToken(this.${ParserGeneratorValues.IdentifierName}, '${this.propertyName}', propValue, ${maxLenStr}, ${patternStr}, parsingErrors);`)
        // TODO The value returned from the parse method is a simple string. Have to convert to InDTMI
        .line(`this.${this.propertyName} = strInDtmiVal`);
      switchScope
        .line('continue;');
    }
  }

  public addCaseToTrySetObjectPropertySwitch(switchScope: TsScope, valueVar: string, keyVar: string): void {
    // if (!this.inherited) {
    switchScope
      .line(`case '${this.propertyName}':`);
    Object.values(this.propertyNameUris).forEach((strVal) => switchScope
        .line(`case '${strVal}':`));
    switchScope
    // .if(`this._${this.propertyName} !== undefined`)
          // .line(`this._${this.propertyName} = (${valueVar} as ${this.baseClassName}).dtmi;`)
          .line(`this.${this.propertyName} = ${valueVar}.dtmi;`)
          .line('return true');
    // switchScope.line('break;');
    // }
  }
}

