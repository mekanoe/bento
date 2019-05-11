import Bento, { IBentoTransport } from '../..'
export type Ok = {
  ok?: boolean
}

export type None = {
}

export type PostQuery = {
  id: string
}

export type Post = {
  id?: string
  content: string
}

export interface ICrudTestService {
  CreatePost (ctx: any, request: Post): Promise<Post>
  ListPosts (ctx: any, request: None): Promise<Post>
  GetPost (ctx: any, request: PostQuery): Promise<Post>
  UpdatePost (ctx: any, request: Post): Promise<Post>
  DeletePost (ctx: any, request: PostQuery): Promise<Ok>
}
export class CrudTestClient {
  static __SERVICE__: string = 'CrudTest'
  constructor (private bento: Bento, private transport?: IBentoTransport) {}
  async CreatePost (request: Post): Promise<Post> {
    return this.bento.makeRequest(this.transport || undefined, 'CrudTest', 'CreatePost', request)
  }
  async ListPosts (request: None): Promise<Post> {
    return this.bento.makeRequest(this.transport || undefined, 'CrudTest', 'ListPosts', request)
  }
  async GetPost (request: PostQuery): Promise<Post> {
    return this.bento.makeRequest(this.transport || undefined, 'CrudTest', 'GetPost', request)
  }
  async UpdatePost (request: Post): Promise<Post> {
    return this.bento.makeRequest(this.transport || undefined, 'CrudTest', 'UpdatePost', request)
  }
  async DeletePost (request: PostQuery): Promise<Ok> {
    return this.bento.makeRequest(this.transport || undefined, 'CrudTest', 'DeletePost', request)
  }
}
