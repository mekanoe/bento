"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_1 = __importDefault(require("./json"));
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
        expect(JSON.parse(t.toString())).toStrictEqual(o);
    });
    it('deserializes a response from a buffer', () => {
        const fixture = Buffer.from(JSON.stringify(o));
        const t = js.deserialize(fixture);
        expect(t).toStrictEqual(o);
    });
    it('deserializes a request from a bufferwithctx', () => {
        const fixture = {
            buffer: Buffer.from(JSON.stringify(i)),
            ctx
        };
        const t = js.deserializeRequest(fixture);
        expect(t).toStrictEqual(i);
    });
});
