/// <reference types="node" />
import Transport from '../transport';
import Bento from '..';
export declare class InMemoryTransport extends Transport {
    sender(data: Buffer): Promise<Buffer>;
}
export declare const createClient: (b: Bento) => InMemoryTransport;
export declare const createServer: (b: Bento) => InMemoryTransport;
