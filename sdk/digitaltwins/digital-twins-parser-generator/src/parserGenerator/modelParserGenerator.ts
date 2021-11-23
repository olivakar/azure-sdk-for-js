// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */

import {TsAccess, TsDeclarationType, TsLibrary} from '../codeGenerator';
import {NameFormatter} from './nameFormatter';
import {TypeGenerator} from './typeGenerator';

export class ModelParserGenerator implements TypeGenerator {
  private readonly _baseClassName: string;

  constructor(baseName: string) {
    this._baseClassName = NameFormatter.formatNameAsImplementation(baseName);
  }

  generateType(parserLibrary: TsLibrary): void {
    this.generateCode(parserLibrary);
  }

  generateCode(parserLibrary: TsLibrary): void {
    // const factoryName = 'ModelParserFactory';
    const factoryClass = parserLibrary.class({name: 'ModelParserFactory', exports: true});
    factoryClass.docString.line(`Class for creation of the parser.`);
    factoryClass.import(`import {ModelParsingOption} from '../parser';`);
    factoryClass.import(`import {ModelParser} from './internal';`);
    factoryClass.import(`import {ModelParserImpl} from './internal';`);
    const createMethod = factoryClass.method({name: 'create', isStatic: true, access: TsAccess.Public, returnType: 'ModelParser'});
    createMethod
      .parameter({name: 'parsingOptions', type: 'ModelParsingOption'});

    createMethod.body
      .line(`const impl = new ModelParserImpl();`)
      .line(`impl.options = parsingOptions;`)
      .line(`return impl;`);

    const interfaceName = 'ModelParser';
    const modelParserInterface = parserLibrary.interface({name: interfaceName, exports: true});
    modelParserInterface.field({name: 'dtmiResolver?', type: 'DtmiResolver'});
    modelParserInterface.field({name: 'options', type: 'ModelParsingOption'});
    modelParserInterface.field({name: 'maxDtdlVersion?', type: 'number'});
    modelParserInterface.method({name: 'parse', returnType: 'Promise<ModelDict>'})
      .parameter({name: 'jsonTexts', type: 'string[]'});
    modelParserInterface.method({name: 'getSupplementalTypeCollection', returnType: 'SupplementalTypeCollection'});
    modelParserInterface.import(`import {DtmiResolver, ModelParsingOption} from '../parser';`);
    modelParserInterface.import(`import {SupplementalTypeCollection, ModelDict} from './internal';`);

    const inheritance = {name: interfaceName, type: TsDeclarationType.Interface};
    const parserClass = parserLibrary.class({name: 'ModelParserImpl', exports: true, inheritance: [inheritance]});
    parserClass.docString.line(`Class for parsing the DTDL langauge.`);
    parserClass.import(`import {DtmiResolver, ElementPropertyConstraint, ModelParsingOption, ParsingError, ResolutionError, ParsingException, JsonSyntaxError} from '../parser';`);
    parserClass.import(`import {AggregateContext, ${this._baseClassName}, Model, ModelDict, ModelParser, ParsedObjectPropertyInfo, PartitionTypeCollection, StandardElements, RootableTypeCollection} from './internal';`);
    parserClass.import(`import {SupplementalTypeCollection} from './internal';`);
    // parserClass.import(`import {TypeChecker} from '../parser/type/typeChecker';`);
    parserClass.inline('./src/parserPartial/modelParserImpl.ts', 'fields');
    parserClass.ctor.body.inline('./src/parserPartial/modelParserImpl.ts', 'constructor');
    parserClass.inline('./src/parserPartial/modelParserImpl.ts', 'methods');
    const parseObjectMethod = parserClass.method({name: '_parseObject', isStatic: true, access: TsAccess.Private});
    parseObjectMethod
      .parameter({name: 'model', type: 'Model'})
      .parameter({name: 'objectPropertyInfoList', type: 'ParsedObjectPropertyInfo[]'})
      .parameter({name: 'elementPropertyConstraints', type: 'ElementPropertyConstraint[]'})
      .parameter({name: 'aggregateContext', type: 'AggregateContext'})
      .parameter({name: 'parsingErrors', type: 'ParsingError[]'})
      .parameter({name: 'object', type: 'any'});

    // If the call signature for `DtEntityInfo.parseObject is changed then we need to update this line.
    parseObjectMethod.body.line(`${this._baseClassName}.parseObject(
      model,
      objectPropertyInfoList,
      elementPropertyConstraints,
      [],
      aggregateContext,
      parsingErrors,
      object,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      true,
      true,
      false,
      new Set(),
    )`);
  }
}
