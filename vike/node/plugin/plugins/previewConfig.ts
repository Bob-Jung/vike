export { previewConfig }

import type { Plugin, ResolvedConfig } from 'vite'
import { assertUsage, getOutDirs, resolveOutDir, markEnvAsPreview } from '../utils.js'
import { getConfigVike } from '../../shared/getConfigVike.js'
import fs from 'fs'
import path from 'path'
import type { ViteDevServer } from 'vite'
import type { ConfigVikeResolved } from '../../../shared/ConfigVike.js'
import { addSsrMiddleware } from '../shared/addSsrMiddleware.js'
import pc from '@brillout/picocolors'
type ConnectServer = ViteDevServer['middlewares']

function previewConfig(): Plugin {
  let config: ResolvedConfig
  let configVike: ConfigVikeResolved
  return {
    name: 'vike:previewConfig',
    apply: 'serve',
    config(config) {
      return {
        build: {
          outDir: resolveOutDir(config)
        }
      }
    },
    async configResolved(config_) {
      config = config_
      configVike = await getConfigVike(config)
    },
    configurePreviewServer(server) {
      markEnvAsPreview()
      return () => {
        assertDist()
        if (!configVike.prerender) {
          addSsrMiddleware(server.middlewares)
        }
        addStatic404Middleware(server.middlewares)
      }
    }
  }
  function assertDist() {
    let { outDirRoot, outDirClient, outDirServer } = getOutDirs(config)
    ;[outDirRoot, outDirClient, outDirServer].forEach((outDirAny) => {
      assertUsage(
        fs.existsSync(outDirAny),
        `Cannot run ${pc.cyan('$ vite preview')}: your app isn't built (the build directory ${pc.cyan(
          outDirAny
        )} is missing). Make sure to run ${pc.cyan('$ vite build')} before running ${pc.cyan('$ vite preview')}.`
      )
    })
  }

  function addStatic404Middleware(middlewares: ConnectServer) {
    const { outDirClient } = getOutDirs(config)
    middlewares.use(config.base, (_, res, next) => {
      const file = path.posix.join(outDirClient, './404.html')
      if (fs.existsSync(file)) {
        res.statusCode = 404
        res.end(fs.readFileSync(file))
      } else {
        next()
      }
    })
  }
}
