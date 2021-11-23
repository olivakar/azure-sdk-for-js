/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {TsClass, TsScope} from '../../codeGenerator';
import {PropertyRepresentation} from './propertyRepresentation';
import {UntypedLiteralProperty} from './untypedLiteralProperty';

// C# doesn't have any typed literals or plural literals, so this class doesn't matter rn.
export class PluralUntypedLiteralProperty extends UntypedLiteralProperty {
  public iterate(outerScope: TsScope, varName: {ref: string}): TsScope {
    return outerScope.for(`const ${varName.ref} of this.${this.propertyName} || []`);
  }

  public checkPresence(outerScope: TsScope): TsScope {
    return outerScope.if(`this.${this.propertyName} !== undefined`);
  }

  public get propertyRepresentation(): PropertyRepresentation {
    return PropertyRepresentation.List;
  }
  public get propertyType(): string {
    return `unknown[]`;
  }

  // public get propertyImplType(): string | undefined {
  //   throw new Error('Method not implemented.');
  // }

  // TODO check if this code will be okay after example.
  public generateConstructorCode(obverseClass:TsClass, ctorScope: TsScope): void {
    // if (!this.inherited) {
    //   const fieldName = '_' + this.propertyName;
    //   ctorScope.line(`this.${fieldName} = [];`);
    // }
    // if (!this.inherited) {
    //   ctorScope.line(`this.${this.propertyName} = [];`);
    // }
    ctorScope.line(`this.${this.propertyName} = [];`);
  }

  public addCaseToParseSwitch(dtdlVersion: number, obverseClass: TsClass, switchScope: TsScope, classIsAugmentable: boolean, classIsPartition: boolean, valueCountVar: string, definedInVar: string): void {
    if (Object.prototype.hasOwnProperty.call(this.propertyDigest, dtdlVersion) && this.propertyDigest[dtdlVersion].allowed) {
      throw new Error('Parsing logic for propertyDigest.IsPlural identifiers not written yet');
    }
  }
}
