/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {TsAccess, TsClass, TsConstructor, TsScope} from '../../codeGenerator';
import {MaterialPropertyDigest} from '../metamodelDigest';
import {ParserGeneratorValues} from '../parserGeneratorValues';
import {MaterialProperty} from './materialProperty';
import {ObjectProperty} from './objectProperty';
import {PropertyRepresentation} from './propertyRepresentation';
import {PropertyRestriction} from './propertyRestricton';
// example is property contents in material class interface
export class DictionaryObjectProperty extends ObjectProperty {
  private _keyProperty? : string;

  constructor(propertyName: string, propertyNameUris: {[dtdlVersion: number]: string}, propertyToken: MaterialPropertyDigest, propertyRestrictions: {[dtdlVersion: number] :PropertyRestriction[]}) {
    super(propertyName, propertyNameUris, propertyToken, propertyRestrictions);
    this._keyProperty = propertyToken._.dictionaryKey;
  }
  public get propertyRepresentation(): PropertyRepresentation {
    return PropertyRepresentation.Dictionary;
  }
  public get propertyType(): string|undefined {
    if (this.interfaceName !== undefined) {
      return `{[value: string]: ${this.interfaceName}}`;
    } else return undefined;
  }

  public get propertyImplType(): string|undefined {
    if (this.implementationName !== undefined) {
      return `{[value: string]: ${this.implementationName}}`;
    } else return undefined;
  }

  public get keyProperty() : string|undefined {
    return this._keyProperty;
  }

  public generateConstructorCode(obverseClass:TsClass, ctorScope: TsScope): void {
    if (!this.inherited) {
      if (obverseClass.name !== this.interfaceName) {
        obverseClass.import(`import {${this.interfaceName}} from './internal';`);
      }
      // const fieldName = '_' + this.propertyName;
      // ctorScope.line(`this.${fieldName} = {};`);
      ctorScope.line(`this.${this.propertyName} = {};`);
    }
  }

  // Generate code to iterate through all elements of the property and assign each one to a variable.
  public iterate(outerScope: TsScope, varName: {ref: string}) {
    const forScope = outerScope.for(`const ${varName.ref} of Object.values(this.${this.propertyName} || {})`);
    varName.ref = `(${varName.ref} as ${this.implementationName})`;
    return forScope;
  }

  // Generate code to determine whether the property has at least one value.
  public checkPresence(outerScope: TsScope) {
    return outerScope.if(`this.${this.propertyName} !== undefined`);
  }

  public addCaseToParseSwitch(dtdlVersion: number, obverseClass: TsClass, switchScope: TsScope, classIsAugmentable: boolean, classIsPartition: boolean, valueCountVar: string, definedInVar: string): void {
    // DIFFERENCE : this generator passes in '${this.keyProperty}' for the keyProp parameter, but the superclass passes in undefined.
    // Otherwise, the two methods are the same for child and super class.
    if (Object.prototype.hasOwnProperty.call(this.propertyDigest, dtdlVersion) && this.propertyDigest[dtdlVersion].allowed) {
      obverseClass.import(`import {${this.versionedClassName[dtdlVersion]}} from './internal';`);

      const propertyVersionDigest = this.propertyDigest[dtdlVersion];
      const valueCountAssignment = this.hasCountRestriction(dtdlVersion) ? `${valueCountVar} = ` : '';
      const valueConstraints = classIsAugmentable? `this._${this.valueConstraintsField}` : 'undefined';
      const definedIn = classIsPartition? `this.${ParserGeneratorValues.IdentifierName}` : `${definedInVar} ?? this.${ParserGeneratorValues.IdentifierName}`;
      const dtmiSegment = `${this.dtmiSegment}`;

      switchScope
      .line(`case '${this.propertyName}':`)
      .line(`case '${this.propertyNameUris[dtdlVersion]}':`);
      if (!this.optional) {
        switchScope.line(`${this.missingPropertyVariable} = false;`);
      }
      switchScope.line(`${valueCountAssignment}${this.versionedClassName[dtdlVersion]}.parseToken(model, objectPropertyInfoList, elementPropertyConstraints, ${valueConstraints}, aggregateContext, parsingErrors, propValue, this.${ParserGeneratorValues.IdentifierName}, ${definedIn}, '${this.propertyName}', '${dtmiSegment}', '${this.keyProperty}', ${propertyVersionDigest.idRequired}, ${propertyVersionDigest.typeRequired}, allowIdReferenceSyntax, this._${this.allowedVersionsField}V${dtdlVersion});`);
      if (propertyVersionDigest.minCount !== undefined) {
        switchScope
        .if(`${valueCountVar} < ${propertyVersionDigest.minCount}`)
          .line('parsingErrors.push(new ParsingError(')
          .line(`'dtmi:dtdl:parsingError:propertyCountBelowMin',`)
          .line('{')
          .line(`cause: \`{primaryId:p} property '${this.propertyName}' has value ${valueCountVar} values, but the required minimum count is ${propertyVersionDigest.minCount}\`,`)
          .line(`action: \`Add one or more '${this.propertyName}' to the object until the minimum count is satisfied.\`,`)
          .line(`primaryId: this.id,`)
          .line(`property: this._${this.propertyName},`)
          .line(`}));`);
      }

      if (propertyVersionDigest.maxCount !== undefined) {
        switchScope
        .if(`${valueCountVar} > ${propertyVersionDigest.maxCount}`)
          .line('parsingErrors.push(new ParsingError(')
          .line(`'dtmi:dtdl:parsingError:propertyCountAboveMax',`)
          .line('{')
          .line(`cause: \`{primaryId:p} property '${this.propertyName}' has value ${valueCountVar} values, but the allowed maximum count is ${propertyVersionDigest.maxCount}\`,`)
          .line(`action: \`Remove one or more '${this.propertyName}' to the object until the maximum count is satisfied.\`,`)
          .line(`primaryId: this.${ParserGeneratorValues.IdentifierName},`)
          .line(`property: '${this.propertyName}',`)
          .line(`}));`);
      }
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
        // .if(`key !== undefined`)
        .if(`key !== undefined && this.${this.propertyName} !== undefined`)
          .line(`this.${this.propertyName}[${keyVar}] = ${valueVar} as ${this.implementationName};`)
          .line('return true');
    switchScope.line('break;');
    // }
  }

  public addCaseToDictionaryKeySwitch(switchScope:TsScope) :void {
    switchScope.line(`case '${this.propertyName}':`);
    switchScope
            .if(`key !== undefined && Object.prototype.hasOwnProperty.call(this.${this.propertyName}, key)`)
              .line('return true')
            .else()
              .line('return false');
  }
}
