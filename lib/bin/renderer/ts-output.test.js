"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsOutput = __importStar(require("./ts-output"));
const protobufjs_1 = __importDefault(require("protobufjs"));
const _ = protobufjs_1.default.parse(`
syntax = "proto3";

service HelloRpc {
  rpc Hello (HelloWorld) returns (HelloWorld) {};
}

message HelloWorld {
  string username = 1;
  required string help = 2;
  repeated string everyone = 3;
}

message ExcludeMe {
  option exclude = true;
}`);
const fixtures = {
    t: _.root.lookupType('HelloWorld'),
    s: _.root.lookupService('HelloRpc')
};
describe('ts-output', () => {
    it('renders types', () => {
        const o = tsOutput.renderType(fixtures.t);
        expect(o).toMatchSnapshot();
    });
    it('renders services', () => {
        const o = tsOutput.renderService(fixtures.s);
        expect(o).toMatchSnapshot();
    });
});
