import Bento, { IBentoTransport } from '..';
export declare type HelloRequest = {
    name?: string;
};
export declare type HelloReply = {
    message?: string;
};
export interface IHelloWorldService {
    sayHello(ctx: any, request: HelloRequest): Promise<HelloReply>;
}
export declare class HelloWorldClient {
    private bento;
    private transport?;
    static __SERVICE__: string;
    constructor(bento: Bento, transport?: IBentoTransport | undefined);
    sayHello(request: HelloRequest): Promise<HelloReply>;
}
declare const _default: () => string;
export default _default;
