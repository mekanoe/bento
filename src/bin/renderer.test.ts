import pbjs from 'protobufjs'
import { prepRender, render, writeOut, shouldExclude, shouldExcludeFile } from './renderer'
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
}

message ExcludeMe {
  option render.exclude = true;
}`)

const excludeFixture = pbjs.parse(`
syntax = "proto3";

option render.exclude = true;

message IShouldntExist {
  string omg = 1;
}
`)

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

  it('excludes on render.exclude', () => {
    const rd = prepRender('test.proto', _.root)

    expect(rd.types.find(v => v.name === 'ExcludeMe')).toBeUndefined()
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

  it('skips processing of an excluded render root', () => {
    expect(shouldExclude(excludeFixture.root)).toBe(true)
    expect(shouldExclude(_.root)).toBe(false)
  })

  it('skips a file based on @bento-exclude comment', () => {
    const file = path.relative(process.cwd(), path.join(__dirname, '../test/fixtures/norender.proto'))
    expect(shouldExcludeFile(file)).toBe(true)
  })
})
