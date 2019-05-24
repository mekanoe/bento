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
var json_1 = require("./serializers/json");
exports.JSONSerializer = json_1.default;
var transport_1 = require("./transport");
exports.Transport = transport_1.default;
class Bento {
    constructor() {
        this.serviceRegistry = new Map();
    }
    /**
     * makes this bento instance able to respond to a service definition's rpcs.
     * @param name service name
     * @param impl service implmentation
     */
    service(name, impl) {
        if (typeof name === 'function') {
            name = name();
        }
        const service = new impl(this);
        this.serviceRegistry.set(name, service);
    }
    /**
     * creates a client
     * @param impl client class implementation
     * @param tt optional transport for sending data
     */
    client(impl, tt) {
        return new impl(this, tt);
    }
    /**
     * make a request over supplied or default transport
     * @param transport optional transport
     * @param service service name
     * @param fn rpc function name
     * @param input input data
     */
    makeRequest(transport, service, fn, input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (transport === undefined) {
                transport = this.transport;
                if (transport === undefined) {
                    throw new Error('Bento: no transport');
                }
            }
            // if we know about it, we'll bypass the full flow
            if (this.serviceRegistry.has(service)) {
                return this.call({ service, fn, input, ctx: { local: true } });
            }
            // serialize
            const reqBuf = transport.serializer.serialize({
                service,
                fn,
                input
            });
            // trigger transport output, await
            const respBuf = yield transport.sender(reqBuf);
            // deserialize
            const resp = transport.serializer.deserialize(respBuf);
            if (resp.error === true) {
                throw new Error(resp.errorMsg);
            }
            return resp.response;
        });
    }
    /**
     * recieve a request from a client
     * @param buf buffer with contextual data attached (e.g. an http handler like koa)
     */
    receiveRequest(buf, serializer) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = serializer.deserializeRequest(buf);
            try {
                const respData = yield this.call(req);
                const respBuf = serializer.serialize({
                    response: respData
                });
                return respBuf;
            }
            catch (e) {
                const respBuf = serializer.serialize({
                    error: true,
                    errorMsg: e
                });
                return respBuf;
            }
        });
    }
    call(req) {
        const { service, fn, input, ctx } = req;
        if (!this.serviceRegistry.has(service)) {
            throw new Error(`Bento: service name ${service} not registered.`);
        }
        const svc = this.serviceRegistry.get(service);
        if (!(fn in svc)) {
            throw new Error(`Bento: service name ${service} doesn't include a ${fn} handler.`);
        }
        const newCtx = Object.assign({}, ctx, { bento: this });
        return svc[fn](newCtx, input);
    }
}
exports.default = Bento;
