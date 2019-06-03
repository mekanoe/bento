#!/usr/bin/env node
import pbjs from 'protobufjs'
export declare const shouldExclude: (t: pbjs.Root | pbjs.Type) => boolean
declare type RenderData = {
  filePath: string;
  types: pbjs.Type[];
  services: pbjs.Service[];
}
export declare const writeOut: (filepath: string, content: string) => Promise<void>
export declare const render: (rd: RenderData) => string
export declare const prepRender: (filePath: string, root: pbjs.Root) => RenderData
export declare const shouldExcludeFile: (fileName: string) => boolean
export declare const processFile: (fileName: string) => Promise<boolean>
export declare const run: (globPaths: string[]) => Promise<void>
export {}
