import { Schema, TransactionHelper } from './transaction-helper'

export class Category {
  public id?: number
  public name?: string
  public itemCnt?: number

  constructor({ id, name, itemCnt }: Category) {
    if (id) this.id = Number(id)
    if (name) this.name = name
    if (itemCnt) this.itemCnt = Number(itemCnt)
  }
}

export const categorySchema: Schema = {
  name: 'category',
  indexes: [
    {
      field: 'name',
      unique: true,
    },
    {
      field: 'itemCnt',
    },
  ],
}

export class CategoryEntity extends TransactionHelper<Category> {
  protected schema: Schema = categorySchema

  protected async afterRead(data: Category | Category[]): Promise<Category | Category[]> {
    if (Array.isArray(data)) {
      data.sort((a: Category, b: Category) => {
        if (a.name && b.name) {
          if (a.name > b.name) return 1
          if (a.name < b.name) return -1
          return 0
        } else {
          return 0
        }
      })
    }

    return data
  }

  protected async beforeDelete(key: number): Promise<void> {
    const category: Category = await this.findOne(key)
    if (category.itemCnt) {
      throw new Error(`it's being referenced by ${category.itemCnt} number of cards`)
    }
  }
}
