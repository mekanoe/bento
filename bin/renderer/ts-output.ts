import pbjs from 'protobufjs'
import StringRenderer from './StringRenderer'
import * as cp from 'child_process'
import camelCase from 'camel-case'

export const translateProtoPath = (filePath: string) => filePath.replace('.proto', '.bento.ts')
export const postWriteTasks = (filePath: string) => {
  // try tslint
  cp.execSync(`yarn tslint ${translateProtoPath(filePath)} --fix`, { encoding: 'utf8', shell: 'sh', stdio: 'ignore' })
}

export const transformRpcName = (inp: string) => camelCase(inp)

export const resolveJSType = (t: string) => {
  switch (t) {
    case 'bool': return 'boolean'
    case 'float': return 'number'
  }

  return t
}
export const renderType = (t: pbjs.Type): string => {
  const { r, data } = new StringRenderer()

  r(`export type ${t.name} = {`)
  for (let field of t.fieldsArray) {
    r(`  ${field.name}${field.required ? '' : '?'}: ${resolveJSType(field.type)}${field.repeated ? '[]' : ''}`)
  }
  r(`}`)

  return data()
}

export const renderService = (s: pbjs.Service): string => {
  const { r, data } = new StringRenderer()

  // service interface
  r(`export interface I${s.name}Service {`)
  for (let rpc of s.methodsArray) {
    r(`  ${transformRpcName(rpc.name)} (ctx: any, request: ${rpc.requestType}): Promise<${rpc.responseType}> | ${rpc.responseType}`)
  }
  r(`}`)

  // client class
  r(`export class ${s.name}Client {`)
  r(`  static __SERVICE__: string = '${s.name}'`)
  r(`  constructor(private bento: Bento, private transport?: IBentoTransport) {}`)
  for (let rpc of s.methodsArray) {
    r(`  async ${transformRpcName(rpc.name)} (request: ${rpc.requestType}): Promise<${rpc.responseType}> {`)
    r(`    return this.bento.makeRequest(this.transport || undefined, '${s.name}', '${rpc.name}', request)`)
    r(`  }`)
  }
  r(`}`)

  return data()
}
