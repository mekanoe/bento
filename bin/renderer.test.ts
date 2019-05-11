import pbjs from 'protobufjs'
import { prepRender, render, writeOut } from './renderer'
import fs from 'fs-extra'
import path from 'path'

const _ = pbjs.parse(`
syntax = "proto3";

service HelloRpc {
  rpc Hello (HelloWorld) returns (HelloWorld) {};
}

message HelloWorld {
  string username = 1;
  required string help = 2;
  repeated string everyone = 3;
}`)

describe('Renderer', () => {

  it('preps a render correctly', () => {
    const rd = prepRender('test.proto', _.root)

    expect(rd).toMatchObject({
      filePath: 'test.proto',
      types: [{
        name: 'HelloWorld'
      }],
      services: [{
        name: 'HelloRpc'
      }]
    })
  })

  it('renders a snapshot', () => {
    const rd = prepRender('test.proto', _.root)

    const out = render(rd)
    expect(out).toMatchSnapshot()
  })

  it('outputs a file', async () => {
    const rd = prepRender('test.proto', _.root)
    const out = render(rd)

    const tmpdir = await fs.mkdtemp('/tmp/bento-render-test')
    const fp = path.join(tmpdir, 'test.proto')

    await writeOut(fp, out)

    const outPath = path.join(tmpdir, 'test.bento.ts')
    expect(await fs.readFile(outPath, { encoding: 'utf8' })).toBe(out)

    await fs.remove(outPath)
    await fs.rmdir(tmpdir)
  })
})
