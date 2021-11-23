// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CodeWriter,
  DependencyGraph,
  TsClass,
  TsClassParams,
  TsEnum,
  TsEnumParams,
  TsFunction,
  TsFunctionParams,
  TsInterface,
  TsInterfaceParams,
  TsMultiLine,
  TsTypeAlias,
  TsTypeAliasParams,
  pascalToCamel,
} from './internal';
import fs from 'fs';
import path from 'path';

const FILE_EXTENSION = '.ts';
const DIR_SEP = '/';
const COPYRIGHT_TEXT = '// Copyright (c) Microsoft Corporation.\r\n// Licensed under the MIT license.';

type TsLibraryObject = TsFunction | TsClass | TsEnum | TsInterface | TsTypeAlias;


/**
 * Class that is responsible for writing generated code to files.
 */
export class TsLibrary {
  private _outputDirectory: string;
  private _tsDataStructres: TsLibraryObject[];
  private _libraryHeader?: TsMultiLine;
  private _dependencyGraph: DependencyGraph;

  constructor(outputDir: string) {
    this._outputDirectory = outputDir;

    this._tsDataStructres = [];
    this._dependencyGraph = new DependencyGraph();
  }

  libraryHeader(text: string) {
    if (this._libraryHeader !== undefined) {
      throw new Error('Cannot overwrite existing library header');
    }
    const tsMultiLine = new TsMultiLine(text);
    this._libraryHeader = tsMultiLine;
    return tsMultiLine;
  }

  class(input: TsClassParams) {
    const tsClass = new TsClass(input);
    this._tsDataStructres.push(tsClass);
    this._dependencyGraph.addNode(tsClass.name);
    if (tsClass.inheritance !== undefined) {
      tsClass.inheritance.forEach((element) => {
        if (Array.isArray(element.name)) {
          element.name.forEach((elementName) => {
            this._dependencyGraph.addDirectedEdge(tsClass.name, elementName);
          });
        } else {
          this._dependencyGraph.addDirectedEdge(tsClass.name, element.name);
        }
      });
    }
    return tsClass;
  }

  function(input: TsFunctionParams) {
    const tsFunction = new TsFunction(input);
    this._tsDataStructres.push(tsFunction);
    this._dependencyGraph.addNode(tsFunction.name);
    return tsFunction;
  }

  typeAlias(input: TsTypeAliasParams) {
    const tsTypeAlias = new TsTypeAlias(input);
    this._tsDataStructres.push(tsTypeAlias);
    this._dependencyGraph.addNode(tsTypeAlias.name);
    return tsTypeAlias;
  }

  enum(input: TsEnumParams) {
    const tsEnum = new TsEnum(input);
    this._tsDataStructres.push(tsEnum);
    this._dependencyGraph.addNode(tsEnum.name);
    return tsEnum;
  }

  interface(input: TsInterfaceParams) {
    const tsInterface = new TsInterface(input);
    this._tsDataStructres.push(tsInterface);
    this._dependencyGraph.addNode(tsInterface.name);
    return tsInterface;
  }

  sortedDependencies(): string[] {
    return this._dependencyGraph.topologicalSort();
  }

  generateInternalFile(): string {
    // generate internal.ts file
    const internalFilePath = this._outputDirectory + DIR_SEP + 'internal' + FILE_EXTENSION;
    const codeWriter = new CodeWriter(internalFilePath);
    codeWriter.writeLine(COPYRIGHT_TEXT);
    codeWriter.break();
    this.sortedDependencies().forEach((typeName) => {
      const fileName = pascalToCamel(typeName);
      codeWriter.writeLine(`export * from './${fileName}';`);
    });


    return internalFilePath;
  }

  generateIndexForGenerated() : string {
    const indexFilePath = this._outputDirectory + DIR_SEP + 'index.ts';
    const codeWriterIndex = new CodeWriter(indexFilePath);
    codeWriterIndex.writeLine(COPYRIGHT_TEXT);
    codeWriterIndex.break();
    codeWriterIndex.writeLine(`export * from './internal';`);
    return indexFilePath;
  }

  generateFiles(generateInternal?: boolean) : string[] {
    const filePaths : string[] = [];
    if (!fs.existsSync(this._outputDirectory)) {
      fs.mkdirSync(this._outputDirectory);
    }
    if (generateInternal) {
      filePaths.push(this.generateInternalFile());
      filePaths.push(this.generateIndexForGenerated());
    }
    this._tsDataStructres.forEach((type) => {
      const typeName = type.name;
      const fileName = pascalToCamel(typeName) + FILE_EXTENSION;
      const filePath = this._outputDirectory + DIR_SEP + fileName;
      filePaths.push(filePath);
      const codeWriter = new CodeWriter(filePath);

      if (this._libraryHeader !== undefined) {
        this._libraryHeader.generateCode(codeWriter);
        codeWriter.break();
      } else {
        // TODO no-empty and no-unused-vars not needed once full parser generation works.
        // Expected putput of unit Tests have been chnaged to pass as well.
        codeWriter.writeLine(COPYRIGHT_TEXT);
        codeWriter.writeLine('/* eslint-disable valid-jsdoc */');
        codeWriter.writeLine('/* eslint-disable guard-for-in */');
        codeWriter.writeLine('/* eslint-disable no-empty */');
        codeWriter.writeLine('/* eslint-disable no-unused-vars */');
        codeWriter.writeLine('/* eslint-disable sort-imports */');
        codeWriter.break();
      }
      type.generateCode(codeWriter);
    });

    return filePaths;
  }

  copyParserFiles() {
    const directoryPath = path.join(__dirname, '../parser');
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return console.log(`Unable to scan directory` + err);
      }

      files.forEach((file) => {
        fs.readFile(file, (error, data) => {
          if (error) {
            console.log(`Unable to read file` + err);
          } else {
            fs.writeFile(file, data, 'utf8', (err) => {
              if (err) {console.log(err)}
            })
          }
        })
      })
    })
  }
}

