// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CodeWriter, TsAccess, TsFieldParams } from "./internal";

/**
 * A field declaration in Typescript.
 * ex:
 *
 * class Point {
 * x: number; <-- this is a field
 * y: number; <-- this is a field
 * }
 *
 * https://www.typescriptlang.org/docs/handbook/2/classes.html#fields
 */
export class TsField {
  private _name: string;
  private _type: string;
  private _access?: TsAccess;
  private _readonly?: boolean;
  private _isStatic?: boolean;
  private _value?: string;
  private _optional?: boolean;
  private _summary?: string;

  constructor({ name, type, access, readonly, isStatic, summary, value, optional }: TsFieldParams) {
    this._name = name;
    this._type = type;
    this._access = access;
    this._readonly = readonly;
    this._isStatic = isStatic;
    this._summary = summary;
    this._value = value;
    this._optional = optional;
  }

  get name() {
    return this._name;
  }

  get type() {
    return this._type;
  }

  get access() {
    return this._access;
  }

  get readonly() {
    return this._readonly;
  }

  get isStatic() {
    return this._isStatic;
  }

  get value() {
    return this._value;
  }

  get optional() {
    return this._optional;
  }

  get summary() {
    return this._summary;
  }

  generateCode(codeWriter: CodeWriter) {
    let prefix = this._access ? `${this._access} ` : ""; // js field
    prefix = prefix.concat(this._isStatic ? `static ` : "");
    prefix = prefix.concat(this._readonly ? `readonly ` : "");
    const postfix = this._value ? ` = ${this._value}` : "";
    const punctuation = this._optional ? "?:" : ":";
    if (this._summary) {
      codeWriter.writeLine(`// ${this._summary}`);
    }
    codeWriter.writeLine(`${prefix}${this._name}${punctuation} ${this._type}${postfix};`);
  }
}
