import { env, createVirtualConsole, Config } from 'jsdom'
import * as SystemJS from 'systemjs'
import * as extend from 'deep-extend'

export function createTestHarness(namespaceRoot: string, mappedPath: string, jsdomConfig: Config = {}) {
  const loweredNamespaceRoot = namespaceRoot.toLowerCase()
  let window: Window
  let systemjs: typeof SystemJS
  return setupJsDom(jsdomConfig).then((win) => {
    window = win
    systemjs = win.SystemJS
    setupSystemJS(systemjs, namespaceRoot, loweredNamespaceRoot, mappedPath)

    return {
      window,

      /**
       * Import module or file.
       * @param identifier Module name or case-insensitive namespace path (`pan/base/grid`)
       * or relative path (`./js/pan/base/grid`)
       */
      async import(identifier: string) {
        const result = await systemjs.import(identifier)
        if (identifier.toLowerCase().indexOf(loweredNamespaceRoot) === 0) {
          const path = namespaceRoot + identifier.slice(namespaceRoot.length)
          return getNamespace(window, path)
        }
        else if (identifier.indexOf(mappedPath) === 0) {
          const path = namespaceRoot + identifier.slice(mappedPath.length)
          return getNamespace(window, path)
        }

        return result
      },
      /**
       * Get the specified target from global namespace.
       * @param path Path to the target, e.g. 'Pan.base.grid'
       */
      get(path: string) {
        if (path.toLowerCase().indexOf(loweredNamespaceRoot) === 0) {
          path = namespaceRoot + path.slice(namespaceRoot.length)
        }
        return getNamespace(window, path)
      }
    }
  })
}
function setupSystemJS(systemjs, namespaceRoot, loweredNamespaceRoot, mappedPath) {
  systemjs.config({
    baseURL: 'node_modules',
    paths: {
      [namespaceRoot]: mappedPath,
      [loweredNamespaceRoot]: mappedPath
    },
    packages: {
      [namespaceRoot]: {
        defaultExtension: 'js'
      },
      [loweredNamespaceRoot]: {
        defaultExtension: 'js'
      }
    },
    packageConfigPaths: [
      '*/package.json',
      '@*/*/package.json'
    ]
  })
}
function setupJsDom(jsdomConfig) {
  return new Promise<any>((resolve, reject) => {
    const virtualConsole = createVirtualConsole().sendTo(console)
    const config = extend(
      {
        file: 'index.html',
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

function getNamespace(root, path) {
  const nodes = path.split(/[.\/]/);
  let m = root[nodes[0]];
  for (let j = 1, len = nodes.length; j < len; j++) {
    if (!m) {
      break;
    }
    const node = nodes[j];
    m = m[node];
  }
  return m;
}
