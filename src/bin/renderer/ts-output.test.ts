import * as tsOutput from './ts-output'
import pbjs from 'protobufjs'

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
  option exclude = true;
}`)

const fixtures = {
  t: _.root.lookupType('HelloWorld'),
  s: _.root.lookupService('HelloRpc')
}

describe('ts-output', () => {
  it('renders types', () => {
    const o = tsOutput.renderType(fixtures.t)

    expect(o).toMatchSnapshot()
  })

  it('renders services', () => {
    const o = tsOutput.renderService(fixtures.s)

    expect(o).toMatchSnapshot()
  })
})
