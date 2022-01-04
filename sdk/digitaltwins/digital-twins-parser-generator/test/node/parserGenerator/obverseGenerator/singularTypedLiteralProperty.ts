/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {TsScope, TsClass} from '../../codeGenerator';
import {ParserGeneratorValues} from '../parserGeneratorValues';
import {PropertyRepresentation} from './propertyRepresentation';
import {TypedLiteralProperty} from './typedLiteralProperty';

export class SingularTypedLiteralProperty extends TypedLiteralProperty {
  public iterate(outerScope: TsScope, varName: {ref: string}): TsScope {
    varName.ref = `this.${this.propertyName}`;

    if (this.literalType.canBeNull(this.propertyDigest._.optional)) {
      return outerScope.if(`this.${this.propertyName} !== undefined`);
    } else {
      return outerScope;
    }
  }

  public checkPresence(outerScope: TsScope): TsScope {
    if (this.literalType.canBeNull(this.propertyDigest._.optional)) {
      return outerScope.if(`this.${this.propertyName} !== undefined`);
    } else {
      return outerScope;
    }
  }

  public get propertyRepresentation(): PropertyRepresentation {
    return (this.literalType.canBeNull(this.optional)) ? PropertyRepresentation.NullableItem : PropertyRepresentation.Item;
  }
  public get propertyType(): string {
    return this.literalType.getSingularType(this.optional);
  }

  public generateConstructorCode(obverseClass:TsClass, ctorScope: TsScope): void {
    // NOTE for Node : any SINGULAR LITERAL types are never initialized inside a Constructor.
    if (this.datatype === 'boolean') {
      ctorScope.line(`this.${this.propertyName} = ${this.literalType.getInitialValue(this.optional)};`);
    }
  }

  public addCaseToParseSwitch(dtdlVersion: number, obverseClass: TsClass, switchScope: TsScope, classIsAugmentable: boolean, classIsPartition: boolean, valueCountVar: string, definedInVar: string): void {
    if (Object.prototype.hasOwnProperty.call(this.propertyDigest, dtdlVersion) && this.propertyDigest[dtdlVersion].allowed) {
      const maxLenStr = this.propertyDigest[dtdlVersion].maxLength?.toString();
      const patternStr = this.propertyDigest[dtdlVersion].pattern? `this.${this.propertyName}PropertyRegexPatternV${dtdlVersion}` : undefined;
      const minInclusiveStr = this.propertyDigest[dtdlVersion].minInclusive?.toString();
      const maxInclusiveStr = this.propertyDigest[dtdlVersion].maxInclusive?.toString();

      switchScope
        .line(`case '${this.propertyName}':`)
        .line(`case '${this.propertyNameUris[dtdlVersion]}':`);
      if (!this.optional) {
        switchScope.line(`${this.missingPropertyVariable} = false;`);
      }

      switch (this.datatype) {
      case 'string':
        switchScope.line(`this.${this.propertyName} = ValueParser.parseSingularStringToken(this.${ParserGeneratorValues.IdentifierName}, '${this.propertyName}', propValue, ${maxLenStr}, ${patternStr}, parsingErrors);`);
        break;
      case 'integer':
        switchScope.line(`this.${this.propertyName} = ValueParser.parseSingularIntegerToken(this.${ParserGeneratorValues.IdentifierName}, '${this.propertyName}', propValue, ${minInclusiveStr}, ${maxInclusiveStr}, parsingErrors);`);
        break;
      case 'boolean':
        switchScope.line(`this.${this.propertyName} = ValueParser.parseSingularBooleanToken(this.${ParserGeneratorValues.IdentifierName}, '${this.propertyName}', propValue, parsingErrors);`);
        break;
      default:
        throw Error(`Parsing logic for ${this.datatype} not written yet.`);
      }
      switchScope
        .line('continue;');
    }
  }
}
