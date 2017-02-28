import { env, createVirtualConsole, Config } from 'jsdom'
import * as SystemJS from 'systemjs'
import * as extend from 'deep-extend'
import * as fileUrl from 'file-url'
import { join } from 'path'

import { TestHarnessConfig, TestHarness, Namespaces } from './interfaces'
import { TestHarnessImpl } from './TestHarnessImpl'

export function createTestHarness(config: TestHarnessConfig, jsdomConfig: Config = {}): Promise<TestHarness> {
  let window: Window
  let systemjs: typeof SystemJS

  // Add `console.debug` to NodeJS environment.
  // so that debug message can be written
  console.debug = console.debug || console.log
  return setupJsDom(jsdomConfig).then((win) => {
    window = win
    systemjs = win.SystemJS
    setupSystemJS(systemjs, config)

    return new TestHarnessImpl(window, config)
  })
}

function setupSystemJS(systemjs, config: TestHarnessConfig) {
  systemjs.config({
    baseURL: 'node_modules',
    map: getPathConfig(config.root, config.namespaces),
    packages: getPackageConfig(config.namespaces),
    packageConfigPaths: [
      '*/package.json',
      '@*/*/package.json'
    ]
  })
}

function getPathConfig(root, namespaces) {
  const keys = Object.keys(namespaces)
  return keys.reduce((v, key) => {
    v[key] = './' + join(root, namespaces[key].path)
    return v
  }, {})
}

function getPackageConfig(namespaces: Namespaces) {
  const keys = Object.keys(namespaces)
  return keys.reduce((v, key) => {
    v[key] = {
      defaultExtension: 'js'
    }
    const ns = namespaces[key];
    if (ns.main) {
      v[key].main = ns.main
    }
    return v
  }, {})
}

function setupJsDom(jsdomConfig) {
  return new Promise<any>((resolve, reject) => {
    const virtualConsole = createVirtualConsole().sendTo(console)
    const config = extend(
      {
        html: '<br>',
        url: fileUrl(process.cwd()) + '/',
        virtualConsole,
        scripts: []
      },
      jsdomConfig,
      {
        done(err, win) {
          if (jsdomConfig.done) {
            try {
              jsdomConfig.done(err, win)
            }
            catch (e) {
              reject(e)
            }
          }

          if (err) {
            reject(err)
          }
          else {
            resolve(win)
          }
        }
      })

    // `deep-extend` can't merge array, so need to push it here instead of declaring above.
    config.scripts.push(require.resolve('systemjs'))

    env(config)
  })
}
