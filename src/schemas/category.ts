import { Schema, TransactionHelper } from './transaction-helper'

export class Category {
  public id?: number
  public name?: string
  public itemCnt?: number

  constructor({ id, name, itemCnt }: Category) {
    if (id) this.id = Number(id)
    if (name) this.name = name
    if (itemCnt) this.itemCnt = itemCnt
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

  protected async beforeDelete(key: number) {
    const category: Category = await this.findOne(key)
    if (!category?.itemCnt || category.itemCnt > 0) {
      throw new Error(`it's being referenced by ${category.itemCnt} number(s) of card(s)`)
    }
  }
}
