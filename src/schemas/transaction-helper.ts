import { DATABASE } from '../constants'

export interface Index {
  field: string
  unique?: boolean
}

export interface Schema {
  name: string
  keyPath?: string
  indexes: Index[]
}

export class TransactionHelper<T> {
  private databaseName: string = DATABASE.name
  private version: number = (DATABASE.version = 1)
  private readonly schema: Schema
  private db?: IDBDatabase

  constructor(schema: Schema) {
    this.schema = schema
  }

  async openDB(): Promise<void> {
    if (!window.indexedDB) throw new Error(`Current browser doesn't support indexedDB`)
    const dbRequest: IDBOpenDBRequest = window.indexedDB.open(this.databaseName, this.version)

    return new Promise((resolve, reject) => {
      dbRequest.onsuccess = () => {
        this.db = dbRequest.result
        debugger
        resolve()
      }
      dbRequest.onupgradeneeded = () => {
        this.db = dbRequest.result
        const keyPath: string = this.schema.keyPath || 'id'
        const useAutoIncrement: boolean = keyPath === 'id'
        const objectStore: IDBObjectStore = this.db?.createObjectStore(this.schema.name, {
          keyPath,
          autoIncrement: useAutoIncrement,
        })

        this.schema.indexes.forEach(({ field, unique }: Index) => {
          objectStore.createIndex(field, field, { unique })
        })
      }
      dbRequest.onerror = () => {
        reject(dbRequest.error)
      }
    })
  }

  private async getObejctStore(mode: 'readwrite' | 'readonly' | 'versionchange' | undefined): Promise<IDBObjectStore> {
    if (!this.db) {
      await this.openDB()
    }

    const objectStore: IDBObjectStore | undefined = this.db
      ?.transaction(this.schema.name, mode)
      .objectStore(this.schema.name)

    if (!objectStore) throw new Error('Failed to get object store')
    return objectStore
  }

  findOne(condition?: Partial<T>): T | null {
    return null
  }

  async find(key?: string): Promise<T[]> {
    try {
      const objectStore: IDBObjectStore = await this.getObejctStore('readonly')
      const request: IDBRequest = objectStore.getAll(key)
      return this.commonResultHandler(request)
    } catch (e) {
      throw e
    }
  }

  async add(data: Partial<T>): Promise<void> {
    try {
      const objectStore: IDBObjectStore = await this.getObejctStore('readwrite')
      const request: IDBRequest = objectStore.add(data)
      return this.commonResultHandler(request)
    } catch (e) {
      throw e
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const objectStore: IDBObjectStore = await this.getObejctStore('readwrite')
      const request: IDBRequest = objectStore.delete(key)
      return this.commonResultHandler(request)
    } catch (e) {
      throw e
    }
  }

  async save(data: Partial<T>, key?: any): Promise<void> {
    try {
      const objectStore: IDBObjectStore = await this.getObejctStore('readwrite')
      let request: IDBRequest
      if (key) {
        request = objectStore.put(data, key)
      } else {
        request = objectStore.put(data)
      }
      return this.commonResultHandler(request)
    } catch (e) {
      throw e
    }
  }

  private commonResultHandler(request: IDBRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
}
