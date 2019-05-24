"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const StringRenderer_1 = __importDefault(require("./StringRenderer"));
const cp = __importStar(require("child_process"));
const camel_case_1 = __importDefault(require("camel-case"));
exports.translateProtoPath = (filePath) => filePath.replace('.proto', '.bento.ts');
exports.postWriteTasks = (filePath) => {
    // try tslint
    cp.execSync(`yarn tslint ${exports.translateProtoPath(filePath)} --fix`, { encoding: 'utf8', shell: 'sh', stdio: 'ignore' });
};
exports.transformRpcName = (inp) => camel_case_1.default(inp);
exports.resolveJSType = (t) => {
    switch (t) {
        case 'bool': return 'boolean';
        case 'float': return 'number';
    }
    return t;
};
exports.renderType = (t) => {
    const { r, data } = new StringRenderer_1.default();
    r(`export type ${t.name} = {`);
    for (let field of t.fieldsArray) {
        r(`  ${field.name}${field.required ? '' : '?'}: ${exports.resolveJSType(field.type)}${field.repeated ? '[]' : ''}`);
    }
    r(`}`);
    return data();
};
exports.renderService = (s) => {
    const { r, data } = new StringRenderer_1.default();
    // service interface
    r(`export interface I${s.name}Service {`);
    for (let rpc of s.methodsArray) {
        r(`  ${exports.transformRpcName(rpc.name)} (ctx: any, request: ${rpc.requestType}): Promise<${rpc.responseType}> | ${rpc.responseType}`);
    }
    r(`}`);
    // client class
    r(`export class ${s.name}Client {`);
    r(`  static __SERVICE__: string = '${s.name}'`);
    r(`  constructor(private bento: Bento, private transport?: IBentoTransport) {}`);
    for (let rpc of s.methodsArray) {
        r(`  async ${exports.transformRpcName(rpc.name)} (request: ${rpc.requestType}): Promise<${rpc.responseType}> {`);
        r(`    return this.bento.makeRequest(this.transport || undefined, '${s.name}', '${rpc.name}', request)`);
        r(`  }`);
    }
    r(`}`);
    return data();
};
