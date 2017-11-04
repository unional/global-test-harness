import test from 'ava'

import { createTestHarness } from './index'

test('load typescript with shadow relative path', async t => {
  const harness = await createTestHarness({
    transpiler: 'typescript',
    rootDir: './fixtures/ts'
  })

  const foo = await harness.import('./foo')
  t.deepEqual(foo, { a: 'foo' })
})

test('load typescript with shadow relative path with extension', async t => {
  const harness = await createTestHarness({
    transpiler: 'typescript',
    rootDir: './fixtures/ts'
  })

  const foo = await harness.import('./foo.ts')
  t.deepEqual(foo, { a: 'foo' })
})

test('load typescript with deep relative path', async t => {
  const harness = await createTestHarness({
    transpiler: 'typescript',
    rootDir: '.',
    namespaces: {
      '': {
        path: './fixtures/ts'
      }
    }
  })

  const foo = await harness.import('./fixtures/ts/foo')
  t.deepEqual(foo, { a: 'foo' })
})

test('load typescript with deep relative path with extension', async t => {
  const harness = await createTestHarness({
    transpiler: 'typescript',
    rootDir: '.',
    namespaces: {
      '': {
        path: './fixtures/ts'
      }
    }
  })

  const foo = await harness.import('./fixtures/ts/foo.ts')
  t.deepEqual(foo, { a: 'foo' })
})
