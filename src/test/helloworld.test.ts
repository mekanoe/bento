import Bento from '../index'
import { HelloWorldClient, HelloRequest } from './helloworld.mock'
import sinon from 'sinon'
// import JSONSerializer from '../serializers/json'
// import Transport from '../src/transport'
import { createServer, createClient } from './fake-transport'

class TestHWServer {
  async sayHello (ctx: any, request: HelloRequest) {
    return {
      message: `hello ${request.name}!`
    }
  }
}

describe('HelloWorld mockup service', () => {
  // generally, i want to implement a server
  // it implements all the request/response things
  // bento is just the connector.
  // - so the client serializes a request via ISerializer
  // - the client uses the ITransport to send data
  // - the server deserializes on recieve
  // - server builds a context, runs the I<T> defined call
  // - server serializes it's response
  // - server responds over it's ITransport
  // - client deserializes response
  // - client promise resolves
  const bentoServer = new Bento()
  bentoServer.service(HelloWorldClient.__SERVICE__, TestHWServer)
  const ttServer = createServer(bentoServer)
  sinon.spy(ttServer, 'sender')
  sinon.spy(ttServer, 'receiver')

  const bentoClient = new Bento()
  const ttClient = createClient(bentoClient)
  sinon.spy(ttClient, 'sender')
  sinon.spy(ttClient, 'receiver')

  const client = bentoClient.client(HelloWorldClient, ttClient)
  it('resolves its own RPCs', async () => {
    const serverClient = bentoServer.client(HelloWorldClient, ttServer)

    expect(
      await serverClient.sayHello({ name: 'world' })
    ).toStrictEqual({
      message: 'hello world!'
    })

    expect((ttServer.sender as any).called).toBe(false)
    expect((ttServer.receiver as any).called).toBe(false)
  })

  it('utilizes client transports', async () => {
    const result = await client.sayHello({ name: 'world2' })
    expect(result.message).toStrictEqual('hello world2!')
    expect((ttServer.receiver as any).called).toBe(true)
    expect((ttClient.sender as any).called).toBe(true)
  })
})
