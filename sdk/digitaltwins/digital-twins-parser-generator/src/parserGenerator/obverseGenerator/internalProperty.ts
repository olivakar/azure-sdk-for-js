/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  TsScope,
  TsClass,
  TsAccess,
  TsConstructor,
  TsDeclarationType,
  TsInterface
} from "../../codeGenerator";
import { MaterialPropertyDigest, PropertyVersionDigest } from "../metamodelDigest";
import { MaterialProperty } from "./materialProperty";
import { PropertyRestriction } from "./propertyRestricton";
import { PropertyKind } from "./propertyKind";
import { PropertyRepresentation } from "./propertyRepresentation";

export class InternalProperty extends MaterialProperty {
  private _access: TsAccess;
  private _propertyType: string;
  private _value: string;
  private _description: string;
  private _isRelevantToIdentity: boolean;

  constructor(
    propertyType: string,
    propertyName: string,
    access: TsAccess,
    value: string,
    description: string,
    isRelevantToIdentity: boolean
  ) {
    super(propertyName, {}, InternalProperty._createEmptyPropertyDigest(), []); // propertyName = entityKind
    this._propertyType = propertyType; // SchemaKinds
    this._access = access;
    this._value = value; // 'date'|'boolean'|'array'
    this._description = description;
    this._isRelevantToIdentity = isRelevantToIdentity;
  }
  public get propertyKind(): PropertyKind {
    return PropertyKind.Internal;
  }

  public get propertyRepresentation(): PropertyRepresentation {
    return PropertyRepresentation.Item;
  }

  public get propertyType(): string {
    return this._propertyType;
  }
  public isParseable(dtdlVersion: number): boolean {
    return false;
  }

  public hasCountRestriction(dtdlVersion: number): boolean {
    return false;
  }

  public addConstructorParam(obverseClass: TsClass, ctor: TsConstructor): string {
    const type = this.propertyType;
    ctor.parameter({ name: this.propertyName, type: type });
    return this.propertyName;
  }
  public generateConstructorCode(obverseClass: TsClass, ctorScope: TsScope): void {
    ctorScope.line(`this.${this.propertyName} = ${this.propertyName};`);
  }
  public iterate(outerScope: TsScope, varName: { ref: string }): TsScope {
    varName.ref = `this.${this.propertyName}`;
    return outerScope;
  }
  public checkPresence(outerScope: TsScope): TsScope {
    return outerScope;
  }
  public addCaseToParseSwitch(
    dtdlVersion: number,
    obverseClass: TsClass,
    switchScope: TsScope,
    classIsAugmentable: boolean,
    classIsPartition: boolean,
    valueCountVar: string,
    definedInVar: string
  ): void {}

  public addCaseToTrySetObjectPropertySwitch(
    switchScope: TsScope,
    valueVar: string,
    keyVar: string
  ): void {
    // pass
  }

  public addRestrictions(
    checkRestrictionsMethodBody: TsScope,
    dtdlVersion: number,
    typeName: string,
    classIsAugmentable: boolean
  ): void {}

  public initMissingPropertyVariable(dtdlVersion: number, scope: TsScope): void {
    if (
      !this.optional &&
      Object.prototype.hasOwnProperty.call(this.propertyDigest, dtdlVersion) &&
      this.propertyDigest[dtdlVersion].allowed
    ) {
      scope.line(`let ${this.missingPropertyVariable} = true;`);
    }
  }
  public addImports(obverseInterface: TsInterface): void {}

  public addMembers(
    dtdlVersions: number[],
    obverseClass: TsClass,
    obverseInterface: TsInterface,
    classIsAugmentable: boolean
  ): void {
    if (!obverseInterface.extends && this.propertyName !== "entityKind") {
      obverseInterface.field({ name: this.propertyName, type: this.propertyType });
    }
    if (this.propertyName === "entityKind") {
      obverseInterface.field({ name: this.propertyName, type: this._value }); // entityKind: 'boolean'|'array'; for entity kind the value becomes the type.
    }
    obverseClass.field({
      name: this.propertyName,
      type: this.propertyType,
      access: TsAccess.Public
    });
  }
  private static _createEmptyPropertyDigest(): MaterialPropertyDigest {
    const emptyDigest = {
      _: {
        literal: false,
        abstract: false,
        plural: false,
        optional: false,
        inherited: false,
        shadowed: false,
        isKey: false,
        isSeg: false,
        description: ""
      }
    };
    return emptyDigest;
  }
}
