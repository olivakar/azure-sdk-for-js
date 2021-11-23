/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {TsAccess, TsClass, TsField, TsInterface} from '../../codeGenerator';
import {MaterialPropertyDigest} from '../metamodelDigest';
import {LiteralProperty} from './literalProperty';
import {PropertyRestriction} from './propertyRestricton';

export abstract class UntypedLiteralProperty extends LiteralProperty {
  private _datatypeField : string;
  constructor(propertyName: string, propertyNameUris :{[dtdlVersion: number]: string}, propertyToken: MaterialPropertyDigest, propertyRestrictions: {[dtdlVersion: number]: PropertyRestriction[]}) {
    super(propertyName, propertyNameUris, propertyToken, propertyRestrictions);
    this._datatypeField = `_${this.propertyName}Datatype`;
  }

  protected get datatypeField() : string {
    return this._datatypeField;
  }

  public addMembers(dtdlVersions: number[], obverseClass: TsClass, obverseInterface:TsInterface, classIsAugmentable:boolean) : void {
    super.addMembers(dtdlVersions, obverseClass, obverseInterface, classIsAugmentable);
    // if (!this.inherited) {
    //   // TODO change to being intialized inside the constructor if needed later.
    //   // TODO should this be private ?
    //   const fieldName = `${this._datatypeField}`;
    //   obverseClass.field({name: fieldName, type: 'string', access: TsAccess.Private, value: ''});
    //   const ctorScope = obverseClass.tsConstructor?.body;
    //   if (ctorScope !== undefined) {
    //     ctorScope.line(`this.${fieldName} = '';`);
    //   }
    // }
    const fieldName = `${this._datatypeField}`;
    obverseClass.field({name: fieldName, type: 'string', access: TsAccess.Private, value: ''});
    const ctorScope = obverseClass.tsConstructor?.body;
    if (ctorScope !== undefined) {
      ctorScope.line(`this.${fieldName} = '';`);
    }
  }
}
