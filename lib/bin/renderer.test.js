"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protobufjs_1 = __importDefault(require("protobufjs"));
const renderer_1 = require("./renderer");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
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
  option render.exclude = true;
}`);
const excludeFixture = protobufjs_1.default.parse(`
syntax = "proto3";

option render.exclude = true;

message IShouldntExist {
  string omg = 1;
}
`);
describe('Renderer', () => {
    it('preps a render correctly', () => {
        const rd = renderer_1.prepRender('test.proto', _.root);
        expect(rd).toMatchObject({
            filePath: 'test.proto',
            types: [{
                    name: 'HelloWorld'
                }],
            services: [{
                    name: 'HelloRpc'
                }]
        });
    });
    it('excludes on render.exclude', () => {
        const rd = renderer_1.prepRender('test.proto', _.root);
        expect(rd.types.find(v => v.name === 'ExcludeMe')).toBeUndefined();
    });
    it('renders a snapshot', () => {
        const rd = renderer_1.prepRender('test.proto', _.root);
        const out = renderer_1.render(rd);
        expect(out).toMatchSnapshot();
    });
    it('outputs a file', () => __awaiter(this, void 0, void 0, function* () {
        const rd = renderer_1.prepRender('test.proto', _.root);
        const out = renderer_1.render(rd);
        const tmpdir = yield fs_extra_1.default.mkdtemp('/tmp/bento-render-test');
        const fp = path_1.default.join(tmpdir, 'test.proto');
        yield renderer_1.writeOut(fp, out);
        const outPath = path_1.default.join(tmpdir, 'test.bento.ts');
        expect(yield fs_extra_1.default.readFile(outPath, { encoding: 'utf8' })).toBe(out);
        yield fs_extra_1.default.remove(outPath);
        yield fs_extra_1.default.rmdir(tmpdir);
    }));
    it('skips processing of an excluded render root', () => {
        expect(renderer_1.shouldExclude(excludeFixture.root)).toBe(true);
        expect(renderer_1.shouldExclude(_.root)).toBe(false);
    });
});
