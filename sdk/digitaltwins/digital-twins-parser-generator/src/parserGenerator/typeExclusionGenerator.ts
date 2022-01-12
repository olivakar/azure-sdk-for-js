// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TsLibrary } from "../codeGenerator";
import { TypeGenerator } from "./typeGenerator";

export class TypeExclusionGenerator implements TypeGenerator {
  constructor(baseName: string) {
    throw new Error(
      "TypeExclusion represents a restriction that excludes a specific type from specified descendants of a class, used for exemplification not parsing. Therefore it is not implemented in JS Parser."
    );
  }
  generateType(parserLibrary: TsLibrary): void {
    throw new Error("Not Implemented!");
  }
}
