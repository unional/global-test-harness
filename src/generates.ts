import { toNamespace } from 'domture'

import { Namespaces } from './interfaces'

export function generateNamespaceToRelativeFunction(root: string, namespaces: Namespaces) {
  const n2r = createN2R(root, namespaces)
  return (path: string) => {
    const node = n2r.find(({ key }) => path.startsWith(key))
    if (node)
      return path.replace(node.key, node.value).replace(/\./g, '/').replace('/', '.')

    return path
  }
}

export function generateRelativeToNamespaceFunction(_root: string, namespaces: Namespaces) {
  const r2n = createR2N(namespaces)
  return (relative: string) => {
    const node = r2n.find(({ key }) => relative.startsWith(key))
    if (node) {
      let ns = toNamespace(relative.slice(node.key.length + 1))
      if (!node.value)
        return ns
      else if (!ns)
        return node.value
      else
        return node.value + '.' + ns
    }

    return toNamespace(relative)
  }
}

function createN2R(_root: string, namespaces: Namespaces) {
  const keys = Object.keys(namespaces)
  return keys.map(key => {
    return {
      key,
      value: namespaces[key]
    }
  }).sort((a, b) => b.key.length - a.key.length)
}

function createR2N(namespaces: Namespaces) {
  const keys = Object.keys(namespaces)
  return keys.map(key => {
    const value = namespaces[key]

    return {
      key: value,
      value: key
    }
  }).sort((a, b) => b.key.length - a.key.length)
}
