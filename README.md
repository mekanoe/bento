# bento

an experimental transport-agnostic RPC system based fully on node.js and protobuf.

this is primarily used with another of my projects, https://github.com/kayteh/roleypoly

## goals

minimum goals for this project. none of these are requirements for your implementation, just what we test against.

- **transport targets**
  - [ ] server/client: NATS
  - [ ] server: http
  - [ ] client: isomorphic-fetch

- **wire format targets**
  - [x] JSON
  - [ ] protobuf

- **generation habits**
  - [ ] on-the-fly codegen for development (e.g. does it without asking)
  - [ ] ahead-of-time codegen too
  - [ ] ts & flow definitions

## developing

working with codegen is a little bumpy for my headspace, but regardless...

```
yarn
yarn test
```