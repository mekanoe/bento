import pbjs from 'protobufjs';
export declare const translateProtoPath: (filePath: string) => string;
export declare const postWriteTasks: (filePath: string) => void;
export declare const transformRpcName: (inp: string) => string;
export declare const resolveJSType: (t: string) => string;
export declare const renderType: (t: pbjs.Type) => string;
export declare const renderService: (s: pbjs.Service) => string;
