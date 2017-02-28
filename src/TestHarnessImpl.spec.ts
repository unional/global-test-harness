import test from 'ava'

import { TestHarnessImpl } from './TestHarnessImpl'

test('lll', t => {
  const target = new TestHarnessImpl({} as any, {
    root: './fixtures/my',
    namespaces: {
      My: {
        path: '.'
      },
      You: {
        path: 'src'
      },
      Him: {
        path: '..'
      }
    }
  })

  const { relativeNamespaceLookup } = target as any

  t.deepEqual(relativeNamespaceLookup, [
    {
      ns: 'My',
      path: './fixtures/my'
    },
    {
      ns: 'You',
      path: './fixtures/my/src'
    },
    {
      ns: 'Him',
      path: './fixtures'
    }
  ])
})
