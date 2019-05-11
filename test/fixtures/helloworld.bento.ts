import Bento, { IBentoTransport } from '../..'
export type HelloRequest = {
  name?: string
}

export type HelloReply = {
  message?: string
}

export interface IHelloWorldService {
  SayHello (ctx: any, request: HelloRequest): Promise<HelloReply>
}
export class HelloWorldClient {
  static __SERVICE__: string = 'HelloWorld'
  constructor (private bento: Bento, private transport?: IBentoTransport) {}
  async SayHello (request: HelloRequest): Promise<HelloReply> {
    return this.bento.makeRequest(this.transport || undefined, 'HelloWorld', 'SayHello', request)
  }
}
