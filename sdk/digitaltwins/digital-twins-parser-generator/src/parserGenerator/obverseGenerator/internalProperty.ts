/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {TsScope, TsClass, TsAccess, TsConstructor, TsDeclarationType, TsInterface} from '../../codeGenerator';
import {MaterialPropertyDigest, PropertyVersionDigest} from '../metamodelDigest';
import {MaterialProperty} from './materialProperty';
import {PropertyRestriction} from './propertyRestricton';
import {PropertyKind} from './propertyKind';
import {PropertyRepresentation} from './propertyRepresentation';

export class InternalProperty extends MaterialProperty {
  private _access : TsAccess;
  private _propertyType : string;
  private _value : string;
  private _description: string;
  private _isRelevantToIdentity: boolean;

  constructor(propertyType:string, propertyName: string, access: TsAccess, value: string, description: string, isRelevantToIdentity: boolean) {
    super(propertyName, {}, InternalProperty._createEmptyPropertyDigest(), []);
    this._propertyType = propertyType;
    this._access = access;
    this._value = value;
    this._description = description;
    this._isRelevantToIdentity = isRelevantToIdentity;
  }
  public get propertyKind() : PropertyKind {
    return PropertyKind.Internal;
  }

  public get propertyRepresentation() : PropertyRepresentation {
    return PropertyRepresentation.Item;
  }

  public get propertyType(): string {
    return this._propertyType;
  }

  // public get propertyImplType(): string | undefined {
  //   return this._propertyType;
  // }

  public isParseable(dtdlVersion:number) : boolean {
    return false;
  }

  public hasCountRestriction(dtdlVersion:number) : boolean {
    return false;
  }

  public addConstructorParam(obverseClass: TsClass, ctor:TsConstructor): string {
    const type = this.propertyType;
    // TODO This weird fix is for an error that happens due to static loading of standard elements
    // which calls the construtor of BooleanInfo and says Cannot set property '2' of undefined
    // which means Cannot set BOOLEAN of undefined. And hence all entityKind field, param in constructor, getter
    // has been made to accept undefined.
    // if (this.propertyName.toLowerCase() === 'entitykind') {
    //   type = `${this.propertyType}|undefined`;
    // }
    const param = {name: this.propertyName, type: type, initializer: this._value};
    ctor.parameter(param);
    if (this.propertyName.toLowerCase() === 'entitykind') {
      obverseClass.import(`import {${this.propertyType}} from './internal';`);
    }
    return this.propertyName;
  }
  public generateConstructorCode(obverseClass:TsClass, ctorScope: TsScope): void {
    // if and only if the obverse class has NO parent that it extends from , then internal properties will be initialized here.
    // if (!obverseClass.inheritance?.some((inType) => inType.type === TsDeclarationType.Class)) {
    // const fieldName = '_' + this.propertyName;
    // ctorScope.line(`this.${fieldName} = ${this.propertyName};`);
    // }
    // if (!obverseClass.inheritance?.some((inType) => inType.type === TsDeclarationType.Class)) {
    //   ctorScope.line(`this.${this.propertyName} = ${this.propertyName};`);
    // }
    ctorScope.line(`this.${this.propertyName} = ${this.propertyName};`);
    // if (this.propertyName == 'dtmi') {
    //   ctorScope.line(`this.id = ${this.propertyName}.value;`);
    // } else if (this.propertyType == 'InDTMI|undefined') {
    //   ctorScope.line(`this.${this.propertyName + 'Id'} = ${this.propertyName}.value;`);
    // }
    // else {
    //   ctorScope.line(`this.${this.propertyName} = ${this.propertyName};`);
    // }
  }
  public iterate(outerScope: TsScope, varName: {ref: string}): TsScope {
    varName.ref = `this.${this.propertyName}`;
    return outerScope;
  }
  public checkPresence(outerScope: TsScope): TsScope {
    return outerScope;
  }
  public addCaseToParseSwitch(dtdlVersion: number, obverseClass: TsClass, switchScope: TsScope, classIsAugmentable: boolean, classIsPartition: boolean, valueCountVar: string, definedInVar: string): void {
  }

  public addCaseToTrySetObjectPropertySwitch(switchScope: TsScope, valueVar: string, keyVar: string): void {
    // pass
  }

  public addRestrictions(checkRestrictionsMethodBody: TsScope, dtdlVersion: number, typeName: string, classIsAugmentable: boolean): void {}

  public initMissingPropertyVariable(dtdlVersion:number, scope: TsScope) : void {
    if (!this.optional && Object.prototype.hasOwnProperty.call(this.propertyDigest, dtdlVersion) && this.propertyDigest[dtdlVersion].allowed) {
      scope.line(`let ${this.missingPropertyVariable} = true;`);
    }
  }
  public addImports(obverseInterface:TsInterface) : void {
    if (!obverseInterface.extends) {
      // obverseInterface.import(`import {InDTMI} from '../parser/internalDtmi';`);
      obverseInterface.import(`import {EntityKind} from './internal';`);
    }
  }

  public addMembers(dtdlVersions: number[], obverseClass: TsClass, obverseInterface:TsInterface, classIsAugmentable:boolean) : void {
    // if and only if the obverse class has NO parent that it extends from , then internal properties will be initialized here.
    // if (!this.inherited && !obverseClass.inheritance?.some((inType) => inType.type === TsDeclarationType.Class)) {
    //   const fieldName = '_' + this.propertyName;
    //   let paramType = this.propertyType;
    //   // TODO This weird fix is for an error that happens due to static loading of standard elements
    //   // which calls the construtor of BooleanInfo and says Cannot set property '2' of undefined
    //   // which means Cannot set BOOLEAN of undefined. And hence all entityKind field, param in constructor, getter
    //   // has been made to accept undefined.
    //   // if (this.propertyName.toLowerCase() === 'entitykind') {
    //   //   paramType = `${this.propertyType}|undefined`;
    //   // }
    //   obverseClass.field({name: fieldName, type: paramType, access: TsAccess.Protected});
    //   let paramReturn = `return this._${this.propertyName};`;
    //   // all this code specially needed for InDTMI to string situations
    //   // and undefined situations and only for getters.
    //   if (this.propertyType.includes('InDTMI')) {
    //     paramType = paramType.replace('InDTMI', 'string');
    //     if (this.propertyType === 'InDTMI|undefined') {
    //       paramReturn = `return this._${this.propertyName}?.value;`;
    //     } else {
    //       paramReturn = `return this._${this.propertyName}.value;`;
    //     }
    //   }

    //   obverseClass.getter({name: `${this.propertyName}`, returnType: `${paramType}`, access: TsAccess.Public})
    //   .body
    //   .line(paramReturn);
    // }
    // if (!this.inherited && !obverseClass.inheritance?.some((inType) => inType.type === TsDeclarationType.Class)) {
    // const paramType = this.propertyType;
    // TODO This weird fix is for an error that happens due to static loading of standard elements
    // which calls the construtor of BooleanInfo and says Cannot set property '2' of undefined
    // which means Cannot set BOOLEAN of undefined. And hence all entityKind field, param in constructor, getter
    // has been made to accept undefined.
    // if (this.propertyName.toLowerCase() === 'entitykind') {
    //   paramType = `${this.propertyType}|undefined`;
    // }
    // obverseClass.field({name: this.propertyName, type: this.propertyType, access: TsAccess.Public});
    // if (!this.inherited && obverseInterface.extends === undefined) {
    // obverseInterface.field({name: this.propertyName, type: this.propertyType});
    // }
    // }
    if (!obverseInterface.extends) {
      obverseInterface.field({name: this.propertyName, type: this.propertyType});
      // if (this.propertyName == 'dtmi') {
      //   obverseInterface.field({name: 'id', type: 'string'});
      // } else if (this.propertyType == 'InDTMI|undefined') {
      //   obverseInterface.field({name: this.propertyName + 'Id', type: 'string|undefined'});
      // } else {
      //   obverseInterface.field({name: this.propertyName, type: this.propertyType});
      // }
    }
    obverseClass.field({name: this.propertyName, type: this.propertyType, access: TsAccess.Public});
  }
  private static _createEmptyPropertyDigest(): MaterialPropertyDigest {
    const emptyDigest = {
      '_': {
        literal: false,
        abstract: false,
        plural: false,
        optional: false,
        inherited: false,
        shadowed: false,
        isKey: false,
        isSeg: false,
        description: '',
      },
    };
    return emptyDigest;
  }
}
