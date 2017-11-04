import { createDomture, DomtureConfig } from 'domture'
import { join } from 'path'
import { unpartial, unpartialRecursively } from 'unpartial'

import { TestHarnessConfig, TestHarness, Namespaces } from './interfaces'
import { TestHarnessImpl } from './TestHarnessImpl'

export async function createTestHarness(givenConfig: Partial<TestHarnessConfig> = {}): Promise<TestHarness> {
  const config = unpartial({ rootDir: '.', namespaces: {} }, givenConfig)
  const map = getPathConfig(config.rootDir, config.namespaces)
  const packages = getPackageConfig(config.namespaces)
  const domture = await createDomture(unpartialRecursively<Partial<DomtureConfig>>({
    packageManager: 'npm',
    systemjsConfig: {
      map,
      packages
    }
  }, config))

  return (new TestHarnessImpl(domture, config) as any) as TestHarness
}

function getPathConfig(root: string, namespaces: Namespaces) {
  const keys = Object.keys(namespaces)
  return keys.reduce<{ [index: string]: string }>((v, key) => {
    v[key] = './' + join(root, namespaces[key].path)
    return v
  }, {})
}

function getPackageConfig(namespaces?: Namespaces) {
  if (!namespaces) {
    return undefined
  }

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
