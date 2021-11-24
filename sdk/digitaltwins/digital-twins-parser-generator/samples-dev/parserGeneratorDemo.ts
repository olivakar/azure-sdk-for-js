// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @summary Demonstrates the use of a Model Parser Generator to validate a PnP model.
 */

const CodeGenerator = require('digital-twins-parser-generator').CodeGenerator;

CodeGenerator.execute('dtdl/digest.json', '../digital-twins-parser/src/generated', '2');
// CodeGenerator.execute('samples/typescript/parserGenerator/sample_digest.json', 'src/generated', '2');
