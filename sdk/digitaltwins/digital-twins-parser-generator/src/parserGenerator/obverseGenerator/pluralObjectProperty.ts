/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {TsClass, TsInterface, TsScope} from '../../codeGenerator';
import {ObjectProperty} from './objectProperty';
import {PropertyRepresentation} from './propertyRepresentation';
// example is property extends in material class interface
export class PluralObjectProperty extends ObjectProperty {
  public iterate(outerScope: TsScope, varName: {ref: string}): TsScope {
    const forScope = outerScope.for(`const ${varName.ref} of this.${this.propertyName} || []`);
    // TODO FOR NEW Change varName
    varName.ref = `(${varName.ref} as ${this.implementationName})`;
    return forScope;
  }
  public checkPresence(outerScope: TsScope): TsScope {
    // TODO: HERE THIS IS .ANY(). Is replacing it with !== undefined enough?
    return outerScope.if(`this.${this.propertyName} !== undefined && this.${this.propertyName}.length !== 0`);
  }
  public get propertyRepresentation(): PropertyRepresentation {
    return PropertyRepresentation.List;
  }
  public get propertyType(): string|undefined {
    if (this.interfaceName !== undefined) {
      return `${this.interfaceName}[]`;
    } else return undefined;
  }

  public get propertyImplType(): string|undefined {
    if (this.implementationName !== undefined) {
      return `${this.implementationName}[]`;
    } else return undefined;
  }

  public generateConstructorCode(obverseClass:TsClass, ctorScope: TsScope): void {
    // if (!this.inherited) {
    //   if (obverseClass.name !== this.implementationName) {
    //     obverseClass.import(`import {${this.implementationName}} from './internal';`);
    //   }
    //   const fieldName = '_' + this.propertyName; // everything is optional and private/protected
    //   ctorScope.line(`this.${fieldName} = [];`);
    // }
    // if (!this.inherited) {
    //   if (obverseClass.name !== this.implementationName) {
    //     obverseClass.import(`import {${this.implementationName}} from './internal';`);
    //   }
    //   ctorScope.line(`this.${this.propertyName} = [];`);
    // }
    if (obverseClass.name !== this.implementationName) {
      obverseClass.import(`import {${this.implementationName}} from './internal';`);
    }
    obverseClass.import(`import {${this.interfaceName}} from './internal';`);
    ctorScope.line(`this.${this.propertyName} = [];`);
  }

  public addImports(obverseInterface:TsInterface) : void {
    if (obverseInterface.name !== this.interfaceName) {
      obverseInterface.import(`import {${this.interfaceName}} from './internal';`);
    }
    // obverseInterface.import(`import {${this.implementationName}} from './internal';`);
  }

  public addCaseToTrySetObjectPropertySwitch(switchScope: TsScope, valueVar: string, keyVar: string): void {
    // if (!this.inherited) {
    switchScope
      .line(`case '${this.propertyName}':`);
    Object.values(this.propertyNameUris).forEach((strVal) => switchScope
        .line(`case '${strVal}':`));
    switchScope
      .if(`this.${this.propertyName} !== undefined`)
          .line(`this.${this.propertyName}.push(${valueVar} as ${this.implementationName});`)
          .line('return true');
    switchScope.line('break;');
    // }
  }
}
