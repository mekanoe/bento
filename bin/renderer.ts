#!/usr/bin/env node

import pbjs from 'protobufjs'
import path from 'path'
import fs from 'fs-extra'
import glob from 'glob'

type RenderData = {
  filePath: string
  types: pbjs.Type[]
  services: pbjs.Service[]
}

const prepRender = (filePath: string, root: pbjs.Root): RenderData => {
  const rd: RenderData = {
    filePath,
    types: [],
    services: []
  }
  for (const obj of root.nestedArray) {
    if (!filePath.includes(obj.filename || '')) {
      continue
    }

    if (obj instanceof pbjs.Type) {
      console.log('got type', obj.name)
      rd.types.push(obj)
      continue
    }

    if (obj instanceof pbjs.Service) {
      console.log('got service', obj.name)
      rd.services.push(obj)
      continue
    }
  }
  return rd
}

const injectResolvePath = (root: pbjs.Root, paths: string[]) => {
  const mainFiles = []
  // console.log(paths)
  root.resolvePath = (origin, target) => {
    let normOrigin = pbjs.util.path.normalize(origin)
    let normTarget = pbjs.util.path.normalize(target)
    if (!normOrigin) {
      mainFiles.push(normTarget)
    }

    // console.log({ normOrigin, normTarget })

    let resolved = pbjs.util.path.resolve(normOrigin, normTarget, true)
    let idx = resolved.lastIndexOf('google/protobuf/')
    if (idx > -1) {
      let altname = resolved.substring(idx)
      console.log({ altname, resolved })
      if (altname in pbjs.common) {
        resolved = altname
      }
    }

    // console.log({ resolved })

    // console.log(1)
    if (fs.existsSync(resolved)) {
      // console.log(2)
      return resolved
    }

    for (let path of paths) {
      let iresolved = pbjs.util.path.resolve(path + '/', target)
      // console.log(3, { path, target })
      if (fs.existsSync(iresolved)) {
        // console.log(4, { iresolved })
        return iresolved
      }
    }

    // console.log(5, { resolved })

    return resolved
  }
}

const processFile = async (fileName: string) => {
  if (fileName.includes('node_modules')) {
    return
  }

  const root = new pbjs.Root()
  const paths = [
    path.relative(process.cwd(), path.dirname(require.resolve('protobufjs'))), // pbjs common
    path.resolve('./proto-inc')
  ]
  injectResolvePath(root, paths)
  const f = await root.load(fileName)

  const rd: RenderData = prepRender(fileName, f)
  console.log(rd)
}

export const run = async (globPath: string) => {
  const files = glob.sync(globPath, {
    ignore: ['node_modules/**/*.proto', '*/proto-inc/**/*.proto']
  })
  if (files.length === 0) {
    console.error('No files found.')
  }

  for (const file of files) {
    await processFile(file)
  }
}

if (require.main === module) {
  const argv = process.argv.slice(process.argv.lastIndexOf(__filename))
  run(argv[1]).catch((e) => {
    console.error(e)
  })
}
