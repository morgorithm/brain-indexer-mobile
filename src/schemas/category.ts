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
  ],
}

export class CategoryEntity extends TransactionHelper<Category> {
  protected schema: Schema = categorySchema
}
