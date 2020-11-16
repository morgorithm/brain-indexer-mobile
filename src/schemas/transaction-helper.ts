import { CRUDHooks } from './crud-hooks'
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

export abstract class TransactionHelper<T> extends CRUDHooks<T> {
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

  async findOne(key: any): Promise<T> {
    try {
      const objectStore: IDBObjectStore = await this.getObejctStore('readonly')
      key = await this.beforeRead(key)
      const request: IDBRequest = objectStore.get(key)
      let data: T = await this.commonResultHandler(request)
      data = (await this.afterRead(data)) as T
      return data
    } catch (e) {
      throw e
    }
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
                let referenceRequest: IDBRequest | null = null
                let referenceData: Record<string, any> = {}
                if (idx.reference?.relationType === RelationType.ManyToOne) {
                  referenceRequest = referenceStore.get(parseInt(item[idx.field]))
                }

                if (referenceRequest) {
                  referenceData = await this.commonResultHandler(referenceRequest)
                }

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

  async delete(key: string): Promise<void> {
    try {
      const objectStore: IDBObjectStore = await this.getObejctStore('readwrite')
      await this.beforeDelete(key)
      const request: IDBRequest = objectStore.delete(key)
      await this.commonResultHandler(request)
      await this.afterDelete()
    } catch (e) {
      throw e
    }
  }

  async save(data: T, key?: any): Promise<void> {
    try {
      const objectStore: IDBObjectStore = await this.getObejctStore('readwrite')
      let request: IDBRequest

      if (key) {
        request = objectStore.put(data, key)
        const createdKey: string | number = await this.commonResultHandler(request)
        await this.afterSave(createdKey)
      } else {
        data = await this.beforeSave(data)
        request = objectStore.put(data)
        const createdKey: string | number = await this.commonResultHandler(request)
        await this.afterSave(createdKey)
      }
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
