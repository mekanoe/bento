#!/usr/bin/env node

import pbjs from 'protobufjs'
import path from 'path'
import fs from 'fs-extra'
import glob from 'glob'

import * as tsOutput from './renderer/ts-output'
import StringRenderer from './renderer/StringRenderer'

const BENTO_LOC = process.env.BENTO_LOC || '@kayteh/bento'

// console.log({ cwd: process.cwd() })

type RenderData = {
  filePath: string
  types: pbjs.Type[]
  services: pbjs.Service[]
}

const flatten = <T> (array: T[][]) => array.reduce((acc, cur) => [...acc, ...cur], [])

export const writeOut = async (filepath: string, content: string) => {
  // still assuming ts.
  const fn = filepath.replace('.proto', '.bento.ts')
  const base = path.basename(fn)
  const atom = fn.replace(base, `.${base}~`)
  await fs.writeFile(atom, content, { encoding: 'utf8' })
  await fs.rename(atom, fn)
}

export const render = (rd: RenderData): string => {
  // assuming ts renderer for now
  // types first
  const { r, data } = new StringRenderer()
  r(`/**
 * GENERATED FILE. This file was generated by @kayteh/bento. Editing it is a bad idea.
 * @generated
 */`)
  r(`import Bento, { IBentoTransport } from '${BENTO_LOC}'`)

  for (let t of rd.types) {
    r(tsOutput.renderType(t))
  }

  for (let s of rd.services) {
    r(tsOutput.renderService(s))
  }

  return data()
}

export const prepRender = (filePath: string, root: pbjs.Root): RenderData => {
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
      // console.log('got type', obj.name)
      if (obj.options !== undefined && obj.options['render.exclude'] === true) {
        continue
      }

      rd.types.push(obj)
      continue
    }

    if (obj instanceof pbjs.Service) {
      // console.log('got service', obj.name)
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
    // console.log({ origin, target })
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
      // console.log({ altname, resolved })
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
    path.resolve(path.join(__dirname, '../../proto-inc'))
  ]
  injectResolvePath(root, paths)
  const f = await root.load(fileName)

  const rd: RenderData = prepRender(fileName, f)
  const rendered = render(rd)

  await writeOut(fileName, rendered)

  tsOutput.postWriteTasks(fileName)

  // TODO: add chalk
  console.log(`📝 Wrote out ${fileName}`)
  console.log(`-- Found RPCs: ${rd.services.map(v => v.name).join(', ')}`)
  console.log(`-- Found types: ${rd.types.map(v => v.name).join(', ')}`)
  console.log('')
}

export const run = async (globPaths: string[]) => {
  const globOpts = {
    ignore: ['./node_modules/**/*.proto', path.join(__dirname, 'proto-inc/**/*.proto')]
  }

  // console.log({ globPaths })

  const globs = globPaths.map(p => glob.sync(p, globOpts))

  const files = flatten(globs)
  // console.log(files)

  if (files.length === 0) {
    console.error('No files found.')
  }

  for (const file of files) {
    await processFile(file)
  }
}

if (require.main === module) {
  run(process.argv.slice(2)).catch((e) => {
    console.error(e)
  })
}