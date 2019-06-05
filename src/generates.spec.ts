import { generateNamespaceToRelativeFunction, generateRelativeToNamespaceFunction } from './generates';

test('gets base namespace', () => {
  const ns = {
    'My': './fixtures/my'
  }

  const fn = generateNamespaceToRelativeFunction('.', ns)

  expect(fn('My')).toBe('./fixtures/my')
})

test('gets longer namespace over shorter one', () => {
  const ns = {
    'My': './fixtures/my',
    'My.sub': './another-place'
  }

  const fn = generateNamespaceToRelativeFunction('.', ns)
  expect(fn('My.sub')).toBe('./another-place')
})

test('convert sub-namespaces to path', () => {
  const ns = {
    'My': './fixtures/my'
  }

  const fn = generateNamespaceToRelativeFunction('.', ns)

  expect(fn('My.x.y')).toBe('./fixtures/my/x/y')
})

test('map with different root', () => {
  const ns = {
    'My': './my'
  }

  const fn = generateNamespaceToRelativeFunction('./fixtures', ns)

  expect(fn('My')).toBe('./my')
})

test('not in namespace list returns a strict translated namespace', () => {
  const ns = { My: './my' }
  const fn = generateRelativeToNamespaceFunction('./fixtures/top', ns)
  expect(fn('./foo')).toBe('foo')
})


test('matching namespace returns it', () => {
  const ns = { My: './my' }
  const fn = generateRelativeToNamespaceFunction('./fixtures/top', ns)
  expect(fn('./my')).toBe('My')
})

test('sub-path maps as sub-namespace', () => {
  const ns = { My: './my' }
  const fn = generateRelativeToNamespaceFunction('./fixtures/top', ns)
  expect(fn('./my/component')).toBe('My.component')
})

test('match longer paths before shorter one', () => {
  const ns = { 'My.bigComponent': './my', 'A.b': './my/comp' }
  const fn = generateRelativeToNamespaceFunction('./fixtures/top', ns)
  expect(fn('./my/y')).toBe('My.bigComponent.y')
  expect(fn('./my/comp')).toBe('A.b')
})
