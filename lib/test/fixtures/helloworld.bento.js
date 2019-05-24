"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class HelloWorldClient {
    constructor(bento, transport) {
        this.bento = bento;
        this.transport = transport;
    }
    sayHello(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bento.makeRequest(this.transport || undefined, 'HelloWorld', 'SayHello', request);
        });
    }
}
HelloWorldClient.__SERVICE__ = 'HelloWorld';
exports.HelloWorldClient = HelloWorldClient;
