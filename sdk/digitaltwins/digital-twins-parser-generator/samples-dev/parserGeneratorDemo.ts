// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @summary Demonstrates the use of a Model Parser Generator to validate a PnP model.
 */

import { ParserCodeGenerator } from '@azure/digital-twins-parser-generator';


ParserCodeGenerator.execute('dtdl/digest.json', '../digital-twins-parser/src/generated', '2');
// CodeGenerator.execute('samples/typescript/parserGenerator/sample_digest.json', 'src/generated', '2');
