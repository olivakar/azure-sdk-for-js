// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable no-unused-vars */


/**
 * @summary Demonstrates the use of a ModelParser to validate a PnP model.
 */

import * as fs from 'fs';
import {ModelParserFactory, ModelParsingOption} from '@azure/digital-twins-parser';

async function main() {
  const rawDtdlDigest:string = fs.readFileSync('samples/typescript/parser/InterfaceContentsEmbeddedV2.json', 'utf-8');
  const parser = ModelParserFactory.create(ModelParsingOption.PermitAnyTopLevelElement);
  const modelDict = await parser.parse([rawDtdlDigest]);
  console.log(modelDict);
  Object.entries(modelDict).forEach(
    ([key, value]) => {
      console.log(key);
      console.log(typeof value);
    },
  );
};

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
