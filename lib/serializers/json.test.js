"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_1 = __importDefault(require("./json"));
const enc = new TextEncoder();
const dec = new TextDecoder();
describe('JSONSerializer', () => {
    const js = new json_1.default();
    const o = {
        response: { message: 'hi there!' }
    };
    const ctx = {
        randomData: true
    };
    const i = {
        service: 'TestWorld',
        fn: 'ButUltraTest!',
        input: { name: 'there' },
        ctx
    };
    it('serializes data into a buffer', () => {
        const t = js.serialize(o);
        expect(JSON.parse(dec.decode(t))).toStrictEqual(o);
    });
    it('deserializes a response from a buffer', () => {
        const fixture = enc.encode(JSON.stringify(o));
        const t = js.deserialize(fixture);
        expect(t).toStrictEqual(o);
    });
    it('deserializes a request from a bufferwithctx', () => {
        const fixture = {
            buffer: enc.encode(JSON.stringify(i)),
            ctx
        };
        const t = js.deserializeRequest(fixture);
        expect(t).toStrictEqual(i);
    });
});
