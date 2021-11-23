/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {TsScope, TsClass} from '../../codeGenerator';
import {ParserGeneratorValues} from '../parserGeneratorValues';
import {IdentifierProperty} from './identifierProperty';
import {PropertyRepresentation} from './propertyRepresentation';

export class PluralIdentifierProperty extends IdentifierProperty {
  public iterate(outerScope: TsScope, varName: {ref: string}): TsScope {
    return outerScope.for(`const ${varName.ref} of this.${this.propertyName} || []`);
  }
  public checkPresence(outerScope: TsScope): TsScope {
    return outerScope;
  }
  public get propertyRepresentation(): PropertyRepresentation {
    return PropertyRepresentation.List;
  }
  public get propertyType(): string|undefined {
    return 'string[]';
  }

  // public get propertyImplType(): string | undefined {
  //   throw new Error('Method not implemented.');
  // }

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

  public addCaseToTrySetObjectPropertySwitch(switchScope: TsScope, valueVar: string, keyVar: string): void {
    // if (!this.inherited) {
    switchScope
      .line(`case '${this.propertyName}':`);
    Object.values(this.propertyNameUris).forEach((strVal) => switchScope
        .line(`case '${strVal}':`));
    switchScope
    // .if(`this._${this.propertyName} !== undefined`)
          .line(`this._${this.propertyName}.push(${valueVar}.dtmi);`)
          .line('return true');
    // switchScope.line('break;');
    // }
  }
}
