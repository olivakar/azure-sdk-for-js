// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CodeWriter } from "./internal";

export class TsImport {
  private _tsImports: Set<string>;

  constructor() {
    this._tsImports = new Set();
  }

  addTsImport(text: string) {
    this._tsImports.add(text);
  }

  generateCode(codeWriter: CodeWriter) {
    this._tsImports.forEach((statement) => {
      codeWriter.writeLine(statement);
    });
  }
}

export class TsImportGeneric {
  private _statement: string;
  constructor(text: string) {
    this._statement = text;
  }

  generateCode(codeWriter: CodeWriter) {
    codeWriter.writeLine(this._statement);
  }
}

export class TsRequireCommonJS {
  private _location: string;
  private _importName: string;

  constructor(location: string, importName: string) {
    this._importName = importName;
    this._location = location;
  }

  generateCode(codeWriter: CodeWriter) {
    codeWriter.writeLine(`const ${this._importName} from '${this._location}';`);
  }
}

export class TsImportStatementES6 {
  private _location: string;
  private _importStatement: string;

  constructor(location: string, importStatement: string) {
    this._location = location;
    this._importStatement = importStatement;
  }

  generateCode(codeWriter: CodeWriter) {
    codeWriter.writeLine(`import {${this._importStatement}} from '${this._location}';`);
  }
}

export class TsImportObjectES6 {
  private _location: string;
  private _objectName?: string;

  constructor(location: string, objectName?: string) {
    this._location = location;
    this._objectName = objectName;
  }

  generateCode(codeWriter: CodeWriter) {
    if (this._objectName) {
      codeWriter.writeLine(`import * as ${this._objectName} from '${this._location}';`);
    } else {
      codeWriter.writeLine(`import ${this._objectName} from ${this._location}`);
    }
  }
}
