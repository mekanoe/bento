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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const HelloWorldTest = __importStar(require("./helloworld.mock"));
const sinon_1 = __importDefault(require("sinon"));
const json_1 = __importDefault(require("../serializers/json"));
// import Transport from '../src/transport'
const fake_transport_1 = require("./fake-transport");
class TestHWServer {
    sayHello(ctx, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                message: `hello ${request.name}!`
            };
        });
    }
}
describe('HelloWorld mockup service', () => {
    // generally, i want to implement a server
    // it implements all the request/response things
    // bento is just the connector.
    // - so the client serializes a request via ISerializer
    // - the client uses the ITransport to send data
    // - the server deserializes on recieve
    // - server builds a context, runs the I<T> defined call
    // - server serializes it's response
    // - server responds over it's ITransport
    // - client deserializes response
    // - client promise resolves
    const bentoServer = new index_1.default(new json_1.default({ verbose: true }));
    bentoServer.service(HelloWorldTest.default, TestHWServer);
    const ttServer = fake_transport_1.createServer(bentoServer);
    sinon_1.default.spy(ttServer, 'sender');
    sinon_1.default.spy(ttServer, 'reciever');
    const bentoClient = new index_1.default(new json_1.default({ verbose: true }));
    const ttClient = fake_transport_1.createClient(bentoClient);
    sinon_1.default.spy(ttClient, 'sender');
    sinon_1.default.spy(ttClient, 'reciever');
    const client = bentoClient.client(HelloWorldTest.HelloWorldClient, ttClient);
    it('resolves its own RPCs', () => __awaiter(this, void 0, void 0, function* () {
        const serverClient = bentoServer.client(HelloWorldTest.HelloWorldClient, ttServer);
        expect(yield serverClient.sayHello({ name: 'world' })).toStrictEqual({
            message: 'hello world!'
        });
        expect(ttServer.sender.called).toBe(false);
        expect(ttServer.reciever.called).toBe(false);
    }));
    it('utilizes client transports', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield client.sayHello({ name: 'world2' });
        expect(result.message).toStrictEqual('hello world2!');
        expect(ttServer.reciever.called).toBe(true);
        expect(ttClient.sender.called).toBe(true);
    }));
});
