// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import {TsAccess, TsClass, TsConstructor, TsInterface, TsScope} from '../../codeGenerator';
import {MaterialPropertyDigest} from '../metamodelDigest';
import {PropertyRestriction} from './propertyRestricton';
import {PropertyKind} from './propertyKind';
import {PropertyRepresentation} from './propertyRepresentation';
import {NameFormatter} from '../nameFormatter';

export abstract class MaterialProperty {
  private _propertyName : string;
  private _propertyNameUris: {[dtdlVersion: number]: string};
  private _propertyToken: MaterialPropertyDigest;
  private _isOptional: boolean;
  private _isInherited : boolean;
  private _isPlural: boolean;
  private _isLiteral: boolean;
  private _propertyRestrictions: {[dtdlVersion: number]: PropertyRestriction[]};
  private _missingPropertyVariable: string;
  private _shadowExpression: string;
  private _dtmiSegment : string|undefined;
  private _baseClassImplementationName : string;

  constructor(propertyName: string, propertyNameUris: {[dtdlVersion: number]: string}, propertyToken: MaterialPropertyDigest, propertyRestrictions: {[dtdlVersion: number]: PropertyRestriction[]}) {
    this._propertyName = propertyName; // in JS this is the same as obversePropertyName
    this._propertyNameUris = propertyNameUris;
    this._propertyToken = propertyToken;
    this._isOptional = propertyToken._.optional ?? false;
    this._isInherited = propertyToken._.inherited ?? false;
    this._isPlural = propertyToken._.plural ?? false;
    this._isLiteral = propertyToken._.literal ?? false;
    this._propertyRestrictions = propertyRestrictions;
    this._missingPropertyVariable = `${propertyName}PropertyMissing`;
    // TODO Ask JD to show generated code.
    this._shadowExpression = propertyToken._.shadowed? `this.original${propertyName} ?? this.${propertyName}` : `this.${propertyName}`;
    this._dtmiSegment = propertyToken._.dtmiSegment;
    this._baseClassImplementationName = `${NameFormatter.formatNameAsImplementation('entity')}`;
  }
  // getters
  public abstract get propertyKind() : PropertyKind;

  public abstract get propertyRepresentation() : PropertyRepresentation;

  public get propertyImplType() : string|undefined {
    return undefined;
  }
  public abstract get propertyType() : string|undefined;

  public get propertyName(): string {
    return this._propertyName;
  }

  protected get propertyNameUris() : {[dtdlVersion: number]: string} {
    return this._propertyNameUris;
  }

  protected get propertyDigest() : MaterialPropertyDigest {
    return this._propertyToken;
  }

  public get optional() : boolean {
    return this._isOptional;
  }

  protected get inherited() : boolean {
    return this._isInherited;
  }

  protected get plural() : boolean {
    return this._isPlural;
  }

  protected get literal() : boolean {
    return this._isLiteral;
  }

  protected get missingPropertyVariable() : string {
    return this._missingPropertyVariable;
  }

  protected get shadowExpression() : string {
    return this._shadowExpression;
  }

  protected get dtmiSegment() : string|undefined {
    return this._dtmiSegment;
  }

  public get baseImplementation() : string {
    return this._baseClassImplementationName;
  }
  // functions
  public abstract isParseable(dtdlversion:number) : boolean;

  public abstract hasCountRestriction(dtdlversion:number) : boolean;

  public abstract generateConstructorCode(obverseClass:TsClass, ctorScope:TsScope) : void;
  public addConstructorParam(obverseClass:TsClass, ctor:TsConstructor): string|undefined {
    return undefined;
  }

  public abstract iterate(outerScope: TsScope, varName: {ref: string}): TsScope;

  public abstract checkPresence(outerScope: TsScope): TsScope;

  get keyProperty() : string|undefined {
    return undefined;
  }

  public addMembers(dtdlVersions:number[], obverseClass:TsClass, obverseInterface:TsInterface, classIsAugmentable:boolean) : void {
    obverseClass.field({name: this.propertyName +'?', type: this.propertyType !== undefined? this.propertyType : 'any', access: TsAccess.Public});
    if (!this.inherited) {
      obverseInterface.field({name: this.propertyName +'?', type: this.propertyType !== undefined? this.propertyType : 'any'});
    }
  }

  // Right now, this only works for interface.
  public addImports(obverseInterface:TsInterface) : void {
  }

  public setValue(dtdlVersion:number, scope: TsScope, infovar:string) : void {
    if (Object.prototype.hasOwnProperty.call(this._propertyToken, dtdlVersion) && this._propertyToken[dtdlVersion].value !== undefined) {
      const propertyVersionDigest = this._propertyToken[dtdlVersion];
      scope.line(`${infovar}.${this.propertyName} = ${propertyVersionDigest.value}`);
    }
  }

  public abstract initMissingPropertyVariable(dtdlVersion:number, scope: TsScope) : void;

  public abstract addCaseToParseSwitch(dtdlVersion:number, obverseClass:TsClass, switchScope:TsScope, classIsAugmentable:boolean, classIsPartition:boolean, valueCountVar:string, definedInVar:string) : void;

  public abstract addCaseToTrySetObjectPropertySwitch(switchOnProperty: TsScope, valueVar:string, keyVar:string):void;
  // TODO
  public addCaseForInstancePropertySwitch(switchOnProperty:TsScope, instancePropVariable:string) : void {

  }

  /**
   * Add code to the CheckRestrictions method in the material class that has this property.
   * @param checkRestrictionsMethodBody - A CsScope object to which to add the code.
   * @param dtdlVersion - The DTDL version that specifies the restrictions.
   * @param typeName - The type name (DTDL term) corresponding to the material class.
   * @param classIsAugmentable - True if the material class is augmentable.
   */
  addRestrictions(checkRestrictionsMethodBody: TsScope, dtdlVersion: number, typeName: string, classIsAugmentable: boolean) {
    if (this._propertyRestrictions !== undefined && this._propertyRestrictions[dtdlVersion]) {
      const restrictions = this._propertyRestrictions[dtdlVersion];
      for (const propertyRestriction of restrictions) {
        propertyRestriction.addRestriction(checkRestrictionsMethodBody, typeName, this);
      }
    }
  }

  // TODO
  public addCaseForValueConstraintSwitch(switchOnProperty:TsScope, instancePropVariable:string) : void {

  }

  public addCaseToDictionaryKeySwitch(switchOnProperty:TsScope) : void {

  }

  public addCheckForRequiredProperty(dtdlVersion:number, scope: TsScope) : void {

  }
}
