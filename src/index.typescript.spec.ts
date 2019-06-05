import { createTestHarness } from '.';

test('load typescript with shadow relative path', async () => {
  const harness = await createTestHarness({
    transpiler: 'typescript',
    rootDir: './fixtures/ts'
  })

  const foo = await harness.import('./foo')
  expect(foo).toEqual({ a: 'foo' })
})

test('load typescript with shadow relative path with extension', async () => {
  const harness = await createTestHarness({
    transpiler: 'typescript',
    rootDir: './fixtures/ts'
  })

  const foo = await harness.import('./foo.ts')
  expect(foo).toEqual({ a: 'foo' })
})

test('load typescript with deep relative path', async () => {
  const harness = await createTestHarness({
    transpiler: 'typescript',
    rootDir: '.',
    namespaces: {
      '': './fixtures/ts'
    }
  })

  const foo = await harness.import('./fixtures/ts/foo')
  expect(foo).toEqual({ a: 'foo' })
})

test('load typescript with deep relative path with extension', async () => {
  const harness = await createTestHarness({
    transpiler: 'typescript',
    rootDir: '.',
    namespaces: {
      '': './fixtures/ts'
    }
  })

  const foo = await harness.import('./fixtures/ts/foo.ts')
  expect(foo).toEqual({ a: 'foo' })
})

test('load typescript and javascript with deep relative path with extension', async () => {
  const harness = await createTestHarness({
    transpiler: 'typescript',
    rootDir: '.',
    namespaces: {
      '': './fixtures/ts'
    }
  })

  const foo = await harness.import('./fixtures/ts/foo.ts')
  expect(foo).toEqual({ a: 'foo' })

  const boo = await harness.import('./fixtures/ts/boo.js')
  expect(boo).toEqual({ a: 'boo' })
})
