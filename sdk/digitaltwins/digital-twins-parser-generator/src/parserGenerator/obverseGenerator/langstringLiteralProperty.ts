/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {TsClass, TsInterface, TsScope} from '../../codeGenerator';
import {ParserGeneratorValues} from '../parserGeneratorValues';
import {LiteralProperty} from './literalProperty';
import {PropertyRepresentation} from './propertyRepresentation';

export class LangStringLiteralProperty extends LiteralProperty {
  public iterate(outerScope: TsScope, varName: {ref: string}): TsScope {
    return outerScope.for(`const ${varName.ref} of Object.values(this.${this.propertyName} || {})`);
  }

  public checkPresence(body: TsScope): TsScope {
    return body;
  }

  public get propertyRepresentation(): PropertyRepresentation {
    return PropertyRepresentation.Dictionary;
  }

  public get propertyType(): string {
    return 'LanguageStringType';
  }

  // public get propertyImplType(): string | undefined {
  //   throw new Error('Method not implemented.');
  // }

  public get keyProperty() : string {
    return '@language';
  }

  public generateConstructorCode(obverseClass:TsClass, ctorScope: TsScope): void {
    // if (!this.inherited) {
    //   const fieldName = '_' + this.propertyName;
    //   ctorScope.line(`this.${fieldName} = {};`);
    //   obverseClass.import(`import {LanguageStringType} from '../parser/type/langstringType';`);
    // }
    // if (!this.inherited) {
    //   ctorScope.line(`this.${this.propertyName} = {};`);
    //   obverseClass.import(`import {LanguageStringType} from '../parser/type/langstringType';`);
    // }
    ctorScope.line(`this.${this.propertyName} = {};`);
    obverseClass.import(`import {LanguageStringType} from '../parser/type/langstringType';`);
  }

  public addImports(obverseInterface:TsInterface) : void {
    if (!obverseInterface.extends) {
      obverseInterface.import(`import {LanguageStringType} from '../parser/type/langstringType';`);
    }
  }

  public addCaseToParseSwitch(dtdlVersion: number, obverseClass: TsClass, switchScope: TsScope, classIsAugmentable: boolean, classIsPartition: boolean, valueCountVar: string, definedInVar: string): void {
    if (Object.prototype.hasOwnProperty.call(this.propertyDigest, dtdlVersion) && this.propertyDigest[dtdlVersion].allowed) {
      const maxLenStr = this.propertyDigest[dtdlVersion].maxLength?.toString();
      const patternStr = this.propertyDigest[dtdlVersion].pattern? `${obverseClass.name}.${this.propertyDigest}PropertyRegexPatternV${dtdlVersion}()` : undefined;
      const defaultLangStr = this.propertyDigest[dtdlVersion].defaultLanguage;
      switchScope
        .line(`case '${this.propertyName}':`)
        .line(`case '${this.propertyNameUris[dtdlVersion]}':`);
      if (!this.optional) {
        switchScope.line(`${this.missingPropertyVariable} = false;`);
      }
      switchScope
        .line(`this.${this.propertyName} = ValueParser.parseLangStringToken(this.${ParserGeneratorValues.IdentifierName}, '${this.propertyName}', propValue, '${defaultLangStr}', ${maxLenStr}, ${patternStr}, parsingErrors);`);

      switchScope
        .line('continue;');
    }
  }
}
