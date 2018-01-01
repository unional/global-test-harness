import { test } from 'ava'

import {
  generateNamespaceToRelativeFunction,
  generateRelativeToNamespaceFunction
} from './generates'

test('gets base namespace', t => {
  const ns = {
    'My': './fixtures/my'
  }

  const fn = generateNamespaceToRelativeFunction('.', ns)

  t.is(fn('My'), './fixtures/my')
})

test('gets longer namespace over shorter one', t => {
  const ns = {
    'My': './fixtures/my',
    'My.sub': './another-place'
  }

  const fn = generateNamespaceToRelativeFunction('.', ns)
  t.is(fn('My.sub'), './another-place')
})

test('convert sub-namespaces to path', t => {
  const ns = {
    'My': './fixtures/my'
  }

  const fn = generateNamespaceToRelativeFunction('.', ns)

  t.is(fn('My.x.y'), './fixtures/my/x/y')
})

test('map with different root', t => {
  const ns = {
    'My': './my'
  }

  const fn = generateNamespaceToRelativeFunction('./fixtures', ns)

  t.is(fn('My'), './my')
})

test('not in namespace list returns a strict translated namespace', t => {
  const ns = { My: './my' }
  const fn = generateRelativeToNamespaceFunction('./fixtures/top', ns)
  t.is(fn('./foo'), 'foo')
})


test('matching namespace returns it', t => {
  const ns = { My: './my' }
  const fn = generateRelativeToNamespaceFunction('./fixtures/top', ns)
  t.is(fn('./my'), 'My')
})

test('sub-path maps as sub-namespace', t => {
  const ns = { My: './my' }
  const fn = generateRelativeToNamespaceFunction('./fixtures/top', ns)
  t.is(fn('./my/component'), 'My.component')
})

test('match longer paths before shorter one', t => {
  const ns = { 'My.bigComponent': './my', 'A.b': './my/comp' }
  const fn = generateRelativeToNamespaceFunction('./fixtures/top', ns)
  t.is(fn('./my/y'), 'My.bigComponent.y')
  t.is(fn('./my/comp'), 'A.b')
})
