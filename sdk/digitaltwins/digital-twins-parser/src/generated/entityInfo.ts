// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import {EntityKind} from './internal';
import {LanguageStringType} from '../parser/type/langstringType';
import {SupplementalTypeInfo} from './internal';
export interface EntityInfo
{
  dtdlVersion: number;
  id: string;
  childOf: string|undefined;
  definedIn: string|undefined;
  entityKind: EntityKind;
  comment?: string;
  description?: LanguageStringType;
  displayName?: LanguageStringType;
  languageVersion?: number;
  supplementalTypeIds: string[];
  supplementalProperties: {[x: string]: any};
  supplementalTypes: SupplementalTypeInfo[];
  undefinedTypes: string[];
  undefinedProperties: {[name: string]: any};
  validateInstance(instanceText: string): boolean ;
}
