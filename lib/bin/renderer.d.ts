#!/usr/bin/env node
import pbjs from 'protobufjs';
declare type RenderData = {
    filePath: string;
    types: pbjs.Type[];
    services: pbjs.Service[];
};
export declare const writeOut: (filepath: string, content: string) => Promise<void>;
export declare const render: (rd: RenderData) => string;
export declare const prepRender: (filePath: string, root: pbjs.Root) => RenderData;
export declare const run: (globPaths: string[]) => Promise<void>;
export {};
