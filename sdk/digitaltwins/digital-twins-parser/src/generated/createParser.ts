// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import {ModelParsingOption} from '../parser';
import {ModelParser} from './internal';
import {ModelParserImpl} from './internal';
/**
 * Function for creation of the model parser.
**/
export function createParser(parsingOptions: ModelParsingOption) {
  const impl = new ModelParserImpl();
  impl.options = parsingOptions;
  return impl;
}
