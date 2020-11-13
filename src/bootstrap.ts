import { Card, CardEntity, Category, CategoryEntity, schemas } from './schemas'

import { DATABASE } from './constants'
import { Index } from './schemas/transaction-helper'

async function bootstrap() {
  await initializeDatabase()
  await import('./pages')
}

async function initializeDatabase() {
  if (!window.indexedDB) throw new Error(`Current browser doesn't support indexedDB`)
  const dbRequest: IDBOpenDBRequest = window.indexedDB.open(DATABASE.name, DATABASE.version)
  let db: IDBDatabase

  return new Promise((resolve, reject) => {
    dbRequest.onsuccess = () => {
      resolve()
    }

    dbRequest.onupgradeneeded = () => {
      db = dbRequest.result

      for (const schema of schemas) {
        const keyPath: string = schema.keyPath || 'id'
        const useAutoIncrement: boolean = keyPath === 'id'
        const objectStore: IDBObjectStore = db?.createObjectStore(schema.name, {
          keyPath,
          autoIncrement: useAutoIncrement,
        })

        schema.indexes.forEach(({ field, unique }: Index) => {
          objectStore.createIndex(field, field, { unique })
        })
      }
    }
    dbRequest.onerror = () => {
      reject(dbRequest.error)
    }
  })
}

bootstrap().then(() => {
  console.log(
    `%c
  ▓▓▓▓  ▓▓▓▓   ▓▓▓  ▓▓▓▓▓ ▓   ▓     ▓▓▓▓▓ ▓▓▓▓  ▓   ▓
  ▓   ▓ ▓   ▓ ▓   ▓   ▓   ▓▓  ▓       ▓   ▓   ▓  ▓ ▓
  ▓▓▓▓  ▓▓▓▓  ▓▓▓▓▓   ▓   ▓ ▓ ▓ ▓▓▓   ▓   ▓   ▓   ▓
  ▓   ▓ ▓  ▓▓ ▓   ▓   ▓   ▓  ▓▓       ▓   ▓   ▓  ▓ ▓
  ▓▓▓▓  ▓   ▓ ▓   ▓ ▓▓▓▓▓ ▓   ▓     ▓▓▓▓▓ ▓▓▓▓  ▓   ▓
  `,
    'color: #8CD790'
  )
})
