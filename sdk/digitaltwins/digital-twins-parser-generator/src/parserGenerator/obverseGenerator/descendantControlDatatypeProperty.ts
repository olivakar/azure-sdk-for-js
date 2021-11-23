// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {TsAccess, TsClass, TsScope} from '../../codeGenerator';
import {DescendantControl} from './descendantControl';
import {MaterialProperty} from './materialProperty';
import {NameFormatter} from '../nameFormatter';
import {ParserGeneratorValues} from '../parserGeneratorValues';
import {PropertyKind} from './propertyKind';

export class DescendantControlDatatypeProperty implements DescendantControl {
  private _dtdlVersion: number;
  private _rootClass: string;
  private _propertyNames: string[];
  private _isNarrow: boolean;
  private _datatypeProperty: string;
  private _coreName: string;
  private _checkMethodName: string;

  constructor(dtdlVersion: number, rootClass: string, propertyNames: string[], isNarrow: boolean, datatypeProperty: string) {
    this._dtdlVersion = dtdlVersion;
    this._rootClass = rootClass;
    this._propertyNames = propertyNames;
    this._isNarrow = isNarrow;
    this._datatypeProperty = datatypeProperty;

    const propertyNameDisjunction = this._propertyNames.map((p) => NameFormatter.formatNameAsProperty(p)).join('or');
    this._coreName = `${propertyNameDisjunction}${this._isNarrow ? 'Narrow': ''}`;
    this._checkMethodName = `checkDescendant${this._coreName}DataType`;
  }

  appliesToType(typeName: string): boolean {
    return this._rootClass === typeName;
  }

  addMembers(obverseClass: TsClass, typeName: string, classIsBase: boolean, classIsAbstract: boolean, materialProperties: MaterialProperty[]): void {
    this.addCheckMethod(obverseClass, classIsBase, classIsAbstract, materialProperties);
  }

  addRestriction(checkRestrictionsMethodBody: TsScope, dtdlVersion: number, typeName: string) {
    if (this._dtdlVersion === dtdlVersion && this._rootClass === typeName) {
      checkRestrictionsMethodBody.line(`const myUri: string = this.${NameFormatter.formatNameAsParameter(this._datatypeProperty)}?.${ParserGeneratorValues.IdentifierName} || ''`);
      checkRestrictionsMethodBody.if(`myUri === 'dtmi:dtdl:instance:Schema:integer;${dtdlVersion}'`)
        .line(`this.${this._checkMethodName}(new InDTMI(this.${ParserGeneratorValues.IdentifierName}), 'number', parsingErrors);`);

      checkRestrictionsMethodBody.if(`myUri === 'dtmi:dtdl:instance:Schema:string;${dtdlVersion}'`)
        .line(`this.${this._checkMethodName}(new InDTMI(this.${ParserGeneratorValues.IdentifierName}), 'string', parsingErrors);`);

      checkRestrictionsMethodBody.if(`myUri === 'dtmi:dtdl:instance:Schema:boolean;${dtdlVersion}'`)
        .line(`this.${this._checkMethodName}(new InDTMI(this.${ParserGeneratorValues.IdentifierName}), 'boolean', parsingErrors);`);
    }
  }

  addTransformation(applyTransformationsMethodBody: TsScope, dtdlVersion: number, typeName: string, materialProperties: MaterialProperty[]): void {}

  addCheckMethod(obverseClass: TsClass, classIsBase: boolean, classIsAbstract: boolean, materialProperties: MaterialProperty[]) {
    if (obverseClass.hasMethod(this._checkMethodName)) {
      return;
    }

    // if (classIsBase) {
    //   const baseClassMethod = obverseClass.method({name: this._checkMethodName, returnType: 'void'});
    //   baseClassMethod.parameter({name: 'ancestorId', type: ParserGeneratorValues.IdentifierType});
    //   baseClassMethod.parameter({name: 'datatype', type: 'string'});
    //   baseClassMethod.parameter({name: 'parsigErrors', type: 'ParsingError[]'});
    // } else if (!classIsAbstract) {
    const checkedFieldName: string = `_checkedDescendant${this._coreName}Datatype`;
    // TODO: Type is a C# concept. Here we are setting to string. is this ok?
    obverseClass.field({name: checkedFieldName, type: 'string | undefined', access: TsAccess.Protected});
    obverseClass.ctor.body.line(`this.${checkedFieldName} = undefined`);
    const concreteClassMethod = obverseClass.method({name: this._checkMethodName, returnType: 'void'});
    concreteClassMethod.parameter({name: 'ancestorId', type: ParserGeneratorValues.IdentifierType});
    // TODO: Type is a C# concept. Here we are setting datatype to string. is this ok?
    concreteClassMethod.parameter({name: 'datatype', type: 'string'});
    concreteClassMethod.parameter({name: 'parsingErrors', type: 'ParsingError[]'});

    const ifNonMatch = concreteClassMethod.body.if(`this.${checkedFieldName} !== datatype`);
    ifNonMatch.line(`this.${checkedFieldName} = datatype;`);

    for (const materialProperty of materialProperties) {
      if (materialProperty.propertyKind === PropertyKind.Object && !this._isNarrow) {
        const varName: {ref: string} = {ref: 'item'};
        materialProperty.iterate(concreteClassMethod.body, varName)
            .line(`${varName.ref}.${this._checkMethodName}(ancestorId, datatype, parsingErrors);`);
      }

      if (materialProperty.propertyKind === PropertyKind.Literal && this._propertyNames.includes(materialProperty.propertyName)) {
        const varName: {ref: string} = {ref: 'item'};
        obverseClass.import(`import {Helpers} from './internal';`);
        materialProperty.iterate(ifNonMatch, varName)
            .if(`typeof(${varName.ref}) !== datatype`)
              .multiLine(`parsingErrors.push(new ParsingError(`)
                .line(`'dtmi:dtdl:parsingError:nonConformantDatatype',`)
                .line(`{`)
                .line(`cause: \`{primaryId:p} property '${materialProperty.propertyName}' has value '{value}'. However, {secondaryId:n} specifies that the datatype of all descendant '${materialProperty.propertyName}' propeties must be \${datatype}.\`,`)
                .line(`action: \`Change the value of property '${materialProperty.propertyName}' to a value whose datatype is \${datatype}.\`,`)
                .line(`primaryId: this.${ParserGeneratorValues.IdentifierName},`)
                .line(`secondaryId: ancestorId.value,`)
                .line(`property: "${materialProperty.propertyName}",`)
                .line(`value: ${varName.ref}.toString(),`)
                .line(`}));`);
      }
    }
    // }
  }
}
