/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {TsScope, TsClass} from '../../codeGenerator';
import {ParserGeneratorValues} from '../parserGeneratorValues';
import {PropertyRepresentation} from './propertyRepresentation';
import {UntypedLiteralProperty} from './untypedLiteralProperty';

export class SingularUntypedLiteralProperty extends UntypedLiteralProperty {
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
  public get propertyType(): string {
    return 'any';
  }
  public generateConstructorCode(obverseClass:TsClass, ctorScope: TsScope): void {
    // NOTE for Node : any SINGULAR NON-LITERAL types should not be initialized inside a Constructor.
  }

  public addCaseToParseSwitch(dtdlVersion: number, obverseClass: TsClass, switchScope: TsScope, classIsAugmentable: boolean, classIsPartition: boolean, valueCountVar: string, definedInVar: string): void {
    if (Object.prototype.hasOwnProperty.call(this.propertyDigest, dtdlVersion) && this.propertyDigest[dtdlVersion].allowed) {
      const maxLenStr = this.propertyDigest[dtdlVersion].maxLength?.toString();
      const patternStr = this.propertyDigest[dtdlVersion].pattern? `this.${this.propertyDigest}PropertyRegexPatternV${dtdlVersion}` : undefined;
      const defaultLangStr = this.propertyDigest[dtdlVersion].defaultLanguage;
      // TODO These may be used in the new values parser.
      const minInclusiveStr = this.propertyDigest[dtdlVersion].minInclusive?.toString();
      const maxInclusiveStr = this.propertyDigest[dtdlVersion].maxInclusive?.toString();

      switchScope
        .line(`case '${this.propertyName}':`)
        .line(`case '${this.propertyNameUris[dtdlVersion]}':`);
      if (!this.plural && !this.optional) {
        switchScope.line(`${this.missingPropertyVariable} = false;`);
      }

      switchScope
        .line('// eslint-disable-next-line no-case-declarations')
        .line(`const ${this.propertyName}ValueAndType = ValueParser.parseSingularLiteralToken(this.${ParserGeneratorValues.IdentifierName}, '${this.propertyName}', propValue, parsingErrors);`)
        .line(`this.${this.propertyName} = ${this.propertyName}ValueAndType.value`)
        .line(`this.${this.datatypeField} = ${this.propertyName}ValueAndType.typeFragment`)
        .line('continue;');
    }
  }
}
