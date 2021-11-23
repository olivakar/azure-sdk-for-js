// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {ResultFormatter} from './internal';

export interface ParsingErrorParams {
  cause: string,
  action: string,
  primaryId?: string,
  secondaryId?: string,
  property?: string,
  value?: string
}

export class ParsingError {
  private _primaryId?: string;
  private _secondaryId?: string;
  private _property?: string;
  private _value?: string;
  private _cause: string;
  private _action: string;
  private _validationId;

  constructor(validationId: string, {cause, action, primaryId, secondaryId, property, value}: ParsingErrorParams) {
    const causeFormatter = new ResultFormatter(cause);
    const actionFormatter = new ResultFormatter(action);

    if (primaryId !== undefined) {
      this._primaryId = primaryId;
      causeFormatter.install('primaryId', primaryId);
      actionFormatter.install('primaryId', primaryId);
    }

    if (secondaryId !== undefined) {
      this._secondaryId = secondaryId;
      causeFormatter.install('secondaryId', secondaryId);
      actionFormatter.install('secondaryId', secondaryId);
    }

    if (property !== undefined) {
      this._property = property;
      causeFormatter.install('property', property);
      actionFormatter.install('property', property);
    }

    if (value !== undefined) {
      this._value = value;
      causeFormatter.install('value', value);
      actionFormatter.install('value', value);
    }

    this._cause = causeFormatter.toString();
    this._action = actionFormatter.toString();

    this._validationId = validationId;
  }

  get primaryId() : string {
    return this._primaryId ?? '';
  }

  get secondaryId(): string {
    return this._secondaryId ?? '';
  }

  get property(): string {
    return this._property ?? '';
  }

  get value(): string {
    return this._value ?? '';
  }

  get cause(): string {
    return this._cause;
  }

  get action(): string {
    return this._action;
  }

  get message(): string {
    return this._cause + ' ' + this._action;
  }

  get validationId(): string {
    return this._validationId;
  }
}
