import { Schema, TransactionHelper } from './transaction-helper'

export const categorySchema: Schema = {
  name: 'category',
  indexes: [
    {
      field: 'name',
      unique: true,
    },
  ],
}

export class CategoryEntity extends TransactionHelper<CategoryEntity> {
  public readonly id?: string
  public name?: string
  public readonly itemCnt: number = 0

  constructor() {
    super(categorySchema)
  }
}
