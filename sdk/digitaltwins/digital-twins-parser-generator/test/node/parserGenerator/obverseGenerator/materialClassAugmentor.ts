/* eslint-disable sort-imports */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {TsAccess, TsClass, TsInterface, TsScope} from '../../codeGenerator';
import {ParserGeneratorValues} from '../parserGeneratorValues';

export class MaterialClassAugmentor {
  public static generateConstructorCode(ctorScope:TsScope, classIsAbstract:boolean, classIsBase:boolean) {
    ctorScope.line('this.supplementalTypeIds = [];');
    ctorScope.line('this.supplementalProperties = {};');
    ctorScope.line('this.supplementalTypes = [];');
  }

  public static addMembers(obverseClass:TsClass, obverseInterface:TsInterface, typeName:string, classIsAbstract:boolean, classIsBase:boolean, anyObjectProperties:boolean) {
    obverseClass.import(`import {SupplementalTypeInfo} from './internal';`);
    obverseClass.import(`import {SupplementalTypeInfoImpl} from './internal';`);
    if (classIsBase) {
      obverseInterface.import(`import {SupplementalTypeInfo} from './internal';`);
    }
    const method = obverseClass.method({name: 'addType', returnType: `void`, abstract: false, isStatic: false, access: TsAccess.Private})
    .parameter({name: 'dtmi', type: 'string'})
    .parameter({name: 'supplementalType', type: 'SupplementalTypeInfo|undefined'});
    if (!classIsAbstract) {
      method.body.line('this.supplementalTypeIds.push(dtmi);');
      const ifScope = method.body.if(`supplementalType !== undefined`);
      ifScope.line('this.supplementalTypes.push(supplementalType);');
      if (anyObjectProperties) {
        method.body.line('(supplementalType as SupplementalTypeInfoImpl).attachConstraints(this);');
        method.body.line('(supplementalType as SupplementalTypeInfoImpl).bindInstanceProperties(this);');
      }
    } else {
      method.body.line(`throw new Error('Attempt to add type to non augmentable type ${typeName}')`);
    }

    let fieldName = 'supplementalTypeIds';
    let fieldType = 'string[]';
    if (classIsBase) {
      obverseInterface.field({name: fieldName, type: fieldType});
    }
    obverseClass.field({name: fieldName, type: fieldType, access: TsAccess.Public});

    fieldName = 'supplementalProperties';
    fieldType = '{[x: string]: any}';
    if (classIsBase) {
      obverseInterface.field({name: fieldName, type: fieldType});
    }
    obverseClass.field({name: fieldName, type: fieldType, access: TsAccess.Public});

    fieldName = 'supplementalTypes';
    fieldType = 'SupplementalTypeInfo[]';
    if (classIsBase) {
      obverseInterface.field({name: fieldName, type: fieldType});
    }
    obverseClass.field({name: fieldName, type: fieldType, access: TsAccess.Public});

    if (!classIsAbstract) {
      const method = obverseClass.method({name: 'tryParseSupplementalProperty', returnType: 'boolean', abstract: false, isStatic: false, access: TsAccess.Private})
        .parameter({name: 'model', type: 'Model'})
        .parameter({name: 'objectPropertyInfoList', type: 'ParsedObjectPropertyInfo[]'})
        .parameter({name: 'elementPropertyConstraints', type: 'ElementPropertyConstraint[]'})
        .parameter({name: 'aggregateContext', type: 'AggregateContext'})
        .parameter({name: 'parsingErrors', type: 'ParsingError[]'})
        .parameter({name: 'propName', type: 'string'})
        .parameter({name: 'propToken', type: 'any'});
      method.body
        .line('const propDtmi = aggregateContext.createDtmi(propName);')
          .if('propDtmi === undefined')
            .line('return false;');
      method.body
        .for('const supplementalType of this.supplementalTypes')
          .if(`(supplementalType as SupplementalTypeInfoImpl).tryParseProperty(model, objectPropertyInfoList, elementPropertyConstraints, aggregateContext, parsingErrors, this.${ParserGeneratorValues.IdentifierName}, propDtmi.value, propToken, this.supplementalProperties)`)
            .line('return true;');
      method.body
        .line('return false;');
    }
  }

  public static addTrySetObjectProperties(scope:TsScope, propVar:string, valueVar:string, keyVar:string, classIsAbstract:boolean) : void {
    if (!classIsAbstract) {
      scope
      .for('const supplementalType of this.supplementalTypes')
        .if(`(supplementalType as SupplementalTypeInfoImpl).trySetObjectProperty(${propVar}, ${valueVar}, ${keyVar}, this.supplementalProperties)`)
          .line('return true;');
    }
  }

  public static addTryParseSupplementalProperty( scope:TsScope, classIsAugmentable:boolean) : void {
    if (classIsAugmentable) {
      scope.if('this.tryParseSupplementalProperty(model, objectPropertyInfoList, elementPropertyConstraints, aggregateContext, parsingErrors, propKey, propValue)')
              .line('continue;');
    }
  }

  public static addChecksForRequiredProperties(body: TsScope, arg1: boolean) {
    body
      .for('const supplementalType of this.supplementalTypes')
        .line(`(supplementalType as SupplementalTypeInfoImpl).checkForRequiredProperties(parsingErrors, this.${ParserGeneratorValues.IdentifierName}, this.supplementalProperties);`);
  }

  static addTypeCheckLine(returnLine: TsScope, classIsAugmentable: boolean) {
    if (classIsAugmentable) {
      returnLine.line(`|| this.supplementalTypes.some((st) => (st as SupplementalTypeInfoImpl).doesHaveType(typeId))`);
    }
  }
}
