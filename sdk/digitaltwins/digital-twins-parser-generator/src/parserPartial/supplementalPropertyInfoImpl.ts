/* eslint-disable valid-jsdoc */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AggregateContext } from "../parser/internal";
import { ValueConstraint } from "../parser/internal";

/**
 * SupplementalPropertyInfo provides information about a property that
 * can be applied to a DTDL element that has a supplemental type.
 */
export class SupplementalPropertyInfoImpl {
  // codegen-outline-begin fields
  // URI that defines the type of the property.
  type: string;
  // True if the property is plural.
  isPlural: boolean;
  // True if the property is optional.
  isOptional: boolean;
  // The maximum count of permitted values of the property.
  minCount?: number;
  // The minimum count of permitted values of the property.
  maxCount?: number;
  // The name of the child property that acts as a dictionary key, or null if this property is not expressed as a dictionary.
  dictionaryKey?: string;
  // The name of a property of which this property's value must be an instance.
  instanceProperty?: string;
  // A ValueConstraint that should be applied to the property
  valueConstraint?: ValueConstraint;
  // codegen-outline-end

  /**
   * Initializes a new instance of the SupplementalPropertyInfo
   */
  constructor(
    type: string,
    isPlural: boolean,
    isOptional: boolean,
    minCount?: number,
    maxCount?: number,
    dictionaryKey?: string,
    instanceProperty?: string,
    valueConstraint?: ValueConstraint
  ) {
    // codegen-outline-begin constructor
    this.type = type;
    this.minCount = minCount;
    this.maxCount = maxCount;
    this.isPlural = isPlural;
    this.isOptional = isOptional;
    this.dictionaryKey = dictionaryKey;
    this.instanceProperty = instanceProperty;

    if (type.includes("dtmi:")) {
      this.valueConstraint = {
        requiredTypes: [type],
        requiredTypesString: AggregateContext.getTermOrUri(type)
      };
    }
    // codegen-outline-end
  }
}
