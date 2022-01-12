// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @summary Demonstrates the use of the Digital Twins Parser Generator to generate a parser based on a given digest file.
 */

import { ParserCodeGenerator } from "@azure/digital-twins-parser-generator";

ParserCodeGenerator.execute("dtdl/digest.json", "../digital-twins-parser/src/generated", "2");
// CodeGenerator.execute('samples/typescript/parserGenerator/sample_digest.json', 'src/generated', '2');
