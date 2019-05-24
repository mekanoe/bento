"use strict";
exports.__esModule = true;
var StringRenderer_1 = require("./StringRenderer");
var cp = require("child_process");
var camel_case_1 = require("camel-case");
exports.translateProtoPath = function (filePath) { return filePath.replace('.proto', '.bento.ts'); };
exports.postWriteTasks = function (filePath) {
    // try tslint
    cp.execSync("yarn tslint " + exports.translateProtoPath(filePath) + " --fix", { encoding: 'utf8', shell: 'sh', stdio: 'ignore' });
};
exports.transformRpcName = function (inp) { return camel_case_1["default"](inp); };
exports.resolveJSType = function (t) {
    switch (t) {
        case 'bool': return 'boolean';
        case 'float': return 'number';
        case 'int32': return 'number';
        case 'int64': return 'number';
    }
    return t;
};
exports.renderType = function (t) {
    var _a = new StringRenderer_1["default"](), r = _a.r, data = _a.data;
    r("export type " + t.name + " = {");
    for (var _i = 0, _b = t.fieldsArray; _i < _b.length; _i++) {
        var field = _b[_i];
        r("  " + field.name + (field.required ? '' : '?') + ": " + exports.resolveJSType(field.type) + (field.repeated ? '[]' : ''));
    }
    r("}");
    return data();
};
exports.renderService = function (s) {
    var _a = new StringRenderer_1["default"](), r = _a.r, data = _a.data;
    // service interface
    r("export interface I" + s.name + "Service {");
    for (var _i = 0, _b = s.methodsArray; _i < _b.length; _i++) {
        var rpc = _b[_i];
        r("  " + exports.transformRpcName(rpc.name) + " (ctx: any, request: " + rpc.requestType + "): Promise<" + rpc.responseType + "> | " + rpc.responseType);
    }
    r("}");
    // client class
    r("export class " + s.name + "Client {");
    r("  static __SERVICE__: string = '" + s.name + "'");
    r("  constructor(private bento: Bento, private transport?: IBentoTransport) {}");
    for (var _c = 0, _d = s.methodsArray; _c < _d.length; _c++) {
        var rpc = _d[_c];
        r("  async " + exports.transformRpcName(rpc.name) + " (request: " + rpc.requestType + "): Promise<" + rpc.responseType + "> {");
        r("    return this.bento.makeRequest(this.transport || undefined, '" + s.name + "', '" + rpc.name + "', request)");
        r("  }");
    }
    r("}");
    return data();
};
