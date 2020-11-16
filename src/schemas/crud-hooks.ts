export abstract class CRUDHooks<T> {
  protected async beforeSave(data: T): Promise<T> {
    return data
  }

  protected async afterSave(createdKey: string | number): Promise<any> {
    return createdKey
  }

  protected async beforeRead(key: any): Promise<any> {
    return key
  }

  protected async afterRead(data: T | T[]): Promise<T | T[]> {
    return data
  }

  protected async beforeDelete(key: any): Promise<any> {
    return key
  }

  protected async afterDelete(): Promise<any> {}
}
