export interface Index {
  field: string
  unique: boolean
}

export interface Schema {
  name: string
  keyPath: string
  indexes: Index[]
}

export class IndexedDB {
  private databaseName: string
  private readonly schemas: Schema[]
  private version: number
  private dbRequest?: IDBOpenDBRequest
  private db?: IDBDatabase

  constructor(databaseName: string, schemas: Schema[], version: number = 1) {
    this.databaseName = databaseName
    this.schemas = schemas
    this.version = version
  }

  createDatabase(): void {
    if (!window.indexedDB) throw new Error(`Current browser doesn't support indexedDB`)
    this.dbRequest = window.indexedDB.open(this.databaseName, this.version)

    this.dbRequest.onsuccess = this.successHandler.bind(this)
    this.dbRequest.onerror = this.errorHandler.bind(this)
    this.dbRequest.onupgradeneeded = this.upgradeNeededHandler.bind(this)
  }

  private upgradeNeededHandler(event: Event) {
    this.db = this.dbRequest?.result

    this.schemas.forEach((schema: Schema) => {
      const objectStore: IDBObjectStore | undefined = this.db?.createObjectStore(schema.name, {
        keyPath: schema.keyPath,
        autoIncrement: true,
      })

      if (objectStore) {
        schema.indexes.forEach(({ field, unique }: Index) => {
          objectStore.createIndex(field, field, { unique })
        })
      }
    })
  }

  private successHandler(event: Event) {}

  private errorHandler(event: Event) {
    throw new Error(this.dbRequest?.error?.message)
  }
}
