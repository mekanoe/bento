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
class CrudTestClient {
    constructor(bento, transport) {
        this.bento = bento;
        this.transport = transport;
    }
    createPost(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bento.makeRequest(this.transport || undefined, 'CrudTest', 'CreatePost', request);
        });
    }
    listPosts(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bento.makeRequest(this.transport || undefined, 'CrudTest', 'ListPosts', request);
        });
    }
    getPost(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bento.makeRequest(this.transport || undefined, 'CrudTest', 'GetPost', request);
        });
    }
    updatePost(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bento.makeRequest(this.transport || undefined, 'CrudTest', 'UpdatePost', request);
        });
    }
    deletePost(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bento.makeRequest(this.transport || undefined, 'CrudTest', 'DeletePost', request);
        });
    }
}
CrudTestClient.__SERVICE__ = 'CrudTest';
exports.CrudTestClient = CrudTestClient;
