// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {pascalToCamel} from '../codeGenerator';

const CLASS_PREFIX = '';
const CLASS_SUFFIX = 'Info';

const ENUM_PREFIX = '';
const ENUM_SUFFIX = 'Kind';

const SUBSTRING_INDEX = 1;
const VARIANT_INDEX = 0;

export class NameFormatter {
  public static formatNameAsProperty(name: string): string { // TODO: Rename this to formatNameAsFragment
    return name.substring(VARIANT_INDEX, VARIANT_INDEX+1).toUpperCase() + name.substring(SUBSTRING_INDEX);
  }
  public static formatNameAsInterface(name: string) : string {
    // should return ArrayInfo if name = array
    return CLASS_PREFIX + name.substring(VARIANT_INDEX, VARIANT_INDEX+1).toUpperCase() + name.substring(SUBSTRING_INDEX) + CLASS_SUFFIX;
  }
  public static formatNameAsImplementation(name: string) : string {
    // should return ArrayInfo if name = array
    return CLASS_PREFIX + name.substring(VARIANT_INDEX, VARIANT_INDEX+1).toUpperCase() + name.substring(SUBSTRING_INDEX) + CLASS_SUFFIX + 'Impl';
  }
  public static formatNameAsParserClass(name: string) : string {
    // should return ArrayParser if name = array
    return CLASS_PREFIX + name.substring(VARIANT_INDEX, VARIANT_INDEX+1).toUpperCase() + name.substring(SUBSTRING_INDEX) + 'Parser';
  }
  public static formatNameAsParameter(name: string) : string {
    return name.substring(VARIANT_INDEX, VARIANT_INDEX+1).toLowerCase() + name.substring(SUBSTRING_INDEX);
  }
  public static formatNameAsEnum(name: string) : string {
    // should return EntityKind if name = entity
    return ENUM_PREFIX + name.substring(VARIANT_INDEX, VARIANT_INDEX+1).toUpperCase() + name.substring(SUBSTRING_INDEX) + ENUM_SUFFIX;
  }
  public static formatNameAsEnumParameter(name: string) : string {
    return name.substring(VARIANT_INDEX, VARIANT_INDEX+1).toLowerCase() + name.substring(SUBSTRING_INDEX) + ENUM_SUFFIX;
  }
  public static formatNameAsEnumProperty(name: string) {
    // arraykind
    return name.substring(VARIANT_INDEX, VARIANT_INDEX+1).toLowerCase() + name.substring(SUBSTRING_INDEX) + ENUM_SUFFIX;
  }
  public static formatNameAsEnumValue(name: string) {
    // Array
    return name.toUpperCase();
  }
  public static formatNameAsField(name: string) : string {
    return name.substring(VARIANT_INDEX, VARIANT_INDEX+1).toLowerCase() + name.substring(SUBSTRING_INDEX);
  }
  public static formatNameAsMethod(name: string) : string {
    return name.substring(VARIANT_INDEX, VARIANT_INDEX+1).toLowerCase() + name.substring(SUBSTRING_INDEX);
  }
  public static formatNameAsTSFile(name: string) {
    return pascalToCamel(name);
  }
}
