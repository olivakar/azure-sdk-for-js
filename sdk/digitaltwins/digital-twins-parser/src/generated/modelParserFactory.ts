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
 * Class for creation of the parser.
**/
export class ModelParserFactory {
  static create(parsingOptions: ModelParsingOption): ModelParser {
    const impl = new ModelParserImpl();
    impl.options = parsingOptions;
    return impl;
  }
}
