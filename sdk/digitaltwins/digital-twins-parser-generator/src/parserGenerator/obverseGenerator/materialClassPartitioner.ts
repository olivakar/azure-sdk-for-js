// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable sort-imports */

import {TsAccess, TsClass, TsFunction, TsInterface, TsScope} from '../../codeGenerator';
import {NameFormatter} from '../nameFormatter';

export class MaterialClassPartitioner {
  static generateConstructorCode(scope: TsScope, classIsPartition:boolean) {
    // scope.line(`this._isPartition = ${classIsPartition}`);
    scope.line(`this.isPartition = ${classIsPartition}`);
  }
  static addMembers(obverseClass: TsClass, obverseInterface:TsInterface, typeName: string, classIsPartition: boolean, classIsBase:boolean) {
    // const fieldName = 'isPartition';
    // obverseClass.field({name: `_${fieldName}`, type: 'boolean', access: TsAccess.Protected});
    obverseClass.field({name: 'isPartition', type: 'boolean', access: TsAccess.Public});
    // obverseClass.getter({name: fieldName, returnType: `boolean`, access: TsAccess.Public})
    //       .body
    //       .line(`return this._${fieldName};`);
    // TODO: Since this is public and accessible from model parser should this go to interface as well?
    // if (classIsBase) {
    //   obverseInterface.field({name: 'isPartition', type: 'boolean'});
    // }

    const setPartitionInfoMethod: TsFunction = obverseClass.method({name: 'setPartitionInfo', returnType: 'void'});
    setPartitionInfoMethod.summary(`Set partition information.`);
    setPartitionInfoMethod.parameter({name: 'partitionJsonText', type: 'string', description: 'A string containing the partition JSON text'});
    if (classIsPartition) {
      setPartitionInfoMethod.body.line(`this.partitionJsonText = partitionJsonText;`);
    } else {
      setPartitionInfoMethod.body.line(`throw new Error(\`attempt to set partition info on non-partition type ${NameFormatter.formatNameAsInterface(typeName)}\`);`);
    }

    if (classIsPartition) {
      obverseClass.field({name: 'partitionJsonText', type: 'string | undefined', access: TsAccess.Private});

      const getJsonLdTextMethod: TsFunction = obverseClass.method({name: 'getJsonLdText', returnType: 'string'});
      getJsonLdTextMethod.summary(`Gets a JSON string that holds the portion of the DTDL model that defines this ${typeName}.`);
      getJsonLdTextMethod.body.line(`return this.partitionJsonText || '';`);

      const getJsonLdMethod: TsFunction = obverseClass.method({name: 'getJsonLd', returnType: 'any'});
      getJsonLdMethod.summary(`Gets a JsonElement that holds the portion of the DTDL model that defines this ${typeName}.`);
      getJsonLdMethod.body
        .line(`return JSON.parse(this.partitionJsonText || '')`);
    }
  }
}
