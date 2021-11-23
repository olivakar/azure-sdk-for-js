/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {TsScope, TsClass} from '../../codeGenerator';
import {MaterialPropertyDigest, PropertyVersionDigest} from '../metamodelDigest';
import {LiteralType} from './literalType';
import {PropertyRepresentation} from './propertyRepresentation';
import {PropertyRestriction} from './propertyRestricton';
import {TypedLiteralProperty} from './typedLiteralProperty';

interface PluralTypedLiteralPropertyParams {
  propertyName: string,
  propertyNameUris: {[x: number]: string},
  propertyDigest: MaterialPropertyDigest,
  propertyRestrictions: {[dtdlVersion: number]: PropertyRestriction[]},
  datatype: string,
  literalType: LiteralType,
}

// C# doesn't have any typed literals or plural literals
export class PluralTypedLiteralProperty extends TypedLiteralProperty {
  constructor({propertyName, propertyNameUris, propertyDigest, propertyRestrictions, datatype, literalType}: PluralTypedLiteralPropertyParams) {
    super({propertyName: propertyName, propertyNameUris: propertyNameUris, propertyDigest: propertyDigest, propertyRestrictions: propertyRestrictions, datatype: datatype, literalType: literalType});
  }
  public iterate(outerScope: TsScope, varName: {ref: string}): TsScope {
    return outerScope.for(`const ${varName.ref} of this.${this.propertyName} || []`);
  }
  public checkPresence(outerScope: TsScope): TsScope {
    return outerScope.if(`this._${this.propertyName} !== undefined`);
  }

  public get propertyRepresentation(): PropertyRepresentation {
    return PropertyRepresentation.List;
  }
  public get propertyType(): string {
    return `${this.literalType.getSingularType(false)}[]`;
  }

  // public get propertyImplType(): string | undefined {
  //   throw new Error('Method not implemented.');
  // }

  // TODO: generateConstructorCode everwhere is using this signature, but in C# it only uses a CsSorted... is obverseClass necessary?
  public generateConstructorCode(obverseClass:TsClass, ctorScope: TsScope): void {
    // TODO: Why doesn't this originally use propertyName??? Ask Oliva.
    // if (!this.inherited) {
    //   ctorScope.line(`this.${this.propertyName} = new ${this.propertyType}();`);
    // }
    // if (!this.inherited) {
    //   ctorScope.line(`this.${this.propertyName} = new ${this.propertyType}();`);
    // }
    ctorScope.line(`this.${this.propertyName} = new ${this.propertyType}();`);
  }

  addEqualsLine(ctorScope: TsScope): void {
    if (!this.propertyDigest._.inherited) { // TODO: This seems wrong. How should I properly do this Oliva?
      ctorScope.line(`&& this.${this.propertyName}.sequenceEqual(other.${this.propertyName})`);
    }
  }

  public addCaseToParseSwitch(dtdlVersion: number, obverseClass: TsClass, switchScope: TsScope, classIsAugmentable: boolean, classIsPartition: boolean, valueCountVar: string, definedInVar: string): void {
    if (Object.prototype.hasOwnProperty.call(this.propertyDigest, dtdlVersion) && this.propertyDigest[dtdlVersion].allowed) {
      throw new Error('Parsing logic for propertyDigest.IsPlural typed literals not written yet');
    }
  }

  // TODO: Why isn't this implemented Oliva? I added it but there are undefined things like propertyVersions and isAllowed.
  // public addValueToObject(dtdlVersion: number, scope: TsScope, objectVar: string, outlineByPartitionVar: string, outlineIfIdentifiedVar: string, contextIdsVar: string): void {
  //   const propertyVersionDigest: PropertyVersionDigest = this.propertyDigest.propertyVersions[dtdlVersion];
  //   if (propertyVersionDigest && propertyVersionDigest.isAllowed) {
  //     scope.if(`${this.shadowExpression}`)
  //       .line(`${objectVar}['${this.propertyName}] = ${this.shadowExpression}[];`);
  //   }
  // }
}
