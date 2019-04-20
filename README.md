# bento

an experimental transport-agnostic RPC system based fully on node.js and protobuf.



## goals

minimum goals for this project. none of these are requirements for your implementation, just what we test against.

- **transport targets**
  - [ ] server/client: NATS
  - [ ] server: http
  - [ ] client: isomorphic-fetch

- **wire format targets**
  - [ ] JSON
  - [ ] protobuf

- **generation habits**
  - [ ] on-the-fly codegen for development (e.g. does it without asking)
  - [ ] ahead-of-time codegen too
  - [ ] ts definitions, optionally flow too (but this increases difficulty)