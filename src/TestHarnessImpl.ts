import { Domture, DOMWindow, SystemJS } from 'domture'
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
    return await this.domture.import(identifier)
  }

  /**
   * Get the specified target from global namespace.
   * @param path Namespace path to the target, e.g. `MyCompany.myproduct.component`
   */
  get(path: string) {
    return getNamespace(this.window, path)
  }

  private isRelative(identifier: string) {
    return identifier.startsWith('.')
  }

  private async resolveRelative(identifier: string) {
    await this.domture.import(identifier)

    const path = this.getNamespacePath(identifier)
    return this.get(path)
  }

  private getNamespacePath(identifier) {
    const matchedNamespaces = this.namespaceLookup.filter(x => identifier.indexOf(x.path) === 0).sort((a, b) => a.ns.length - b.ns.length)

    const matched = matchedNamespaces.length === 0 ? { ns: '', path: '/' } : matchedNamespaces[0]
    const pathWithExtension = identifier.slice(matched.path.length + 1)
    const lastIndexOfDot = pathWithExtension.lastIndexOf('.');
    const path = lastIndexOfDot !== -1 ? pathWithExtension.slice(0, lastIndexOfDot) : pathWithExtension
    return matched.ns ? [matched.ns, path].join('/') : path
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
