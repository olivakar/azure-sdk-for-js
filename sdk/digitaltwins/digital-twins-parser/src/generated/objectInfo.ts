// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import {ComplexSchemaInfo} from './internal';
import {FieldInfo} from './internal';
export interface ObjectInfo extends ComplexSchemaInfo
{
  fields?: FieldInfo[];
}
