import { DATABASE, DatabaseConfiguration } from './constants'
import { Index, Schema } from './schemas/transaction-helper'

import { schemas } from './schemas'

async function bootstrap() {
  await initializeDatabase(schemas, DATABASE)
  await import('./pages')
}

export async function initializeDatabase(schemas: Schema[], databaseConfig: DatabaseConfiguration) {
  if (!window.indexedDB) throw new Error(`Current browser doesn't support indexedDB`)
  const dbRequest: IDBOpenDBRequest = window.indexedDB.open(databaseConfig.name, databaseConfig.version)
  let db: IDBDatabase

  return new Promise((resolve, reject) => {
    dbRequest.onsuccess = () => {
      resolve()
    }

    dbRequest.onupgradeneeded = () => {
      db = dbRequest.result

      schemas = schemas.filter((schema: Schema) => !db.objectStoreNames.contains(schema.name))

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
