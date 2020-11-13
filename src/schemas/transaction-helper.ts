import { DATABASE } from '../constants'

export const enum RelationType {
  ManyToOne,
  OneToOne,
  ManyToMany,
  OneToMany,
}

export interface Reference {
  relationType: RelationType
}

export interface Index {
  field: string
  unique?: boolean
  reference?: Reference
}

export interface Schema {
  name: string
  keyPath?: string
  indexes: Index[]
}

export abstract class TransactionHelper<T> {
  protected abstract schema: Schema
  protected databaseName: string = DATABASE.name
  protected version: number = (DATABASE.version = 1)
  private db?: IDBDatabase

  async openDB(): Promise<void> {
    if (!window.indexedDB) throw new Error(`Current browser doesn't support indexedDB`)
    const dbRequest: IDBOpenDBRequest = window.indexedDB.open(this.databaseName, this.version)

    return new Promise((resolve, reject) => {
      dbRequest.onsuccess = () => {
        this.db = dbRequest.result
        resolve()
      }

      dbRequest.onerror = () => {
        reject(dbRequest.error)
      }
    })
  }

  private async getObejctStore(
    mode: 'readwrite' | 'readonly' | 'versionchange' | undefined,
    store?: string
  ): Promise<IDBObjectStore> {
    if (!this.db) {
      await this.openDB()
    }

    const objectStore: IDBObjectStore | undefined = this.db
      ?.transaction(store || this.schema.name, mode)
      .objectStore(store || this.schema.name)

    if (!objectStore) throw new Error('Failed to get object store')
    return objectStore
  }

  findOne(condition?: Partial<T>): T | null {
    return null
  }

  async find(objectStore?: IDBObjectStore): Promise<T[]> {
    try {
      if (!objectStore) {
        objectStore = await this.getObejctStore('readonly')
      }
      const request: IDBRequest = objectStore.getAll()
      const data: T[] = await this.commonResultHandler(request)

      if (this.schema.indexes.some((idx: Index) => idx.reference)) {
        for (let idx of this.schema.indexes) {
          if (idx.reference) {
            const referenceStore: IDBObjectStore = await this.getObejctStore('readonly', idx.field)

            await Promise.all(
              data.map(async (item: Record<string, any>) => {
                const referenceRequest: IDBRequest = referenceStore.get(parseInt(item[idx.field]))
                const referenceData: Record<string, any> = await this.commonResultHandler(referenceRequest)
                item[idx.field] = referenceData
              })
            )
          }
        }
      }

      return data
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

  async save(data: Partial<T> | T, key?: any): Promise<void> {
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
