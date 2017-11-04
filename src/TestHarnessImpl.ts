import { Domture, DOMWindow, SystemJS } from 'domture'

// import { join } from 'path'

import { TestHarnessConfig } from './interfaces'
import { log } from './log'


export class TestHarnessImpl {
  public window: DOMWindow
  public systemjs: SystemJS
  private namespaceLookup: Array<{ ns: string, path: string }> = []

  constructor(private domture: Domture, private config: TestHarnessConfig) {
    const { window, systemjs } = domture
    this.window = window
    this.systemjs = systemjs

    for (let ns in config.namespaces) {
      const path = config.namespaces[ns].path
      this.namespaceLookup.push({
        ns,
        path
      })
    }
  }

  /**
   * Import module or file.
   * @param identifier Can be either:
   * Module name: `color-map`,
   * Namespace path: `MyCompany.myproduct.component`
   * Relative path (from root): `./src/index.js`
   */
  async import(identifier: string) {
    log.debug('importing', identifier)
    if (this.isRelative(identifier)) {
      return this.resolveRelative(identifier)
    }

    const matchedNamespace = this.getMatchedNamespace(identifier)
    if (matchedNamespace) {
      return this.resolveNamespace(identifier)
    }
    const result = await this.domture.import(identifier)

    return result
  }

  /**
   * Get the specified target from global namespace.
   * @param path Namespace path to the target, e.g. `MyCompany.myproduct.component`
   */
  get(path: string) {
    // const namespace = this.getMatchedNamespace(path)
    // if (namespace) {
    //   path =
    // }
    // if (path.toLowerCase().indexOf(loweredNamespaceRoot) === 0) {
    //   path = namespaceRoot + path.slice(namespaceRoot.length)
    // }
    return getNamespace(this.window, path)
  }

  private isRelative(identifier: string) {
    return identifier.startsWith('.')
  }

  private async resolveRelative(identifier: string) {
    const result = await this.domture.import(identifier)
    log.debug(result)
    const matchedNamespaces = this.namespaceLookup.filter(x => identifier.indexOf(x.path) === 0)
    const matched = matchedNamespaces.reduce((v, c) => {
      return c.ns.length > v.ns.length ? c : v
    }, { ns: '', path: '' })

    const pathWithExtension = identifier.slice(matched.path.length + 1)
    const indexOfFirstDot = pathWithExtension.indexOf('.');
    const path = pathWithExtension.slice(0, indexOfFirstDot)
    return getNamespace(result, path)
  }

  private getMatchedNamespace(identifier: string) {
    for (const ns in this.config.namespaces) {
      if (identifier.indexOf(ns) === 0) {
        return ns
      }
    }
    return undefined
  }

  private async resolveNamespace(identifier: string) {
    const path = identifier.replace(/\./g, '/')
    await this.domture.import(path)
    return getNamespace(this.window, identifier)
  }

}

function getNamespace(root: any, path: string) {
  // console.log(root, path);

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
