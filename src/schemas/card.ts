import { Schema, TransactionHelper } from './transaction-helper'

import { CategoryEntity } from './category'

export const cardSchema: Schema = {
  name: 'card',
  keyPath: 'name',
  indexes: [
    {
      field: 'name',
      unique: true,
    },
    {
      field: 'categoryId',
    },
  ],
}
export class CardEntity extends TransactionHelper<CardEntity> {
  public name?: string
  public description?: string
  public category?: CategoryEntity

  constructor() {
    super(cardSchema)
  }
}
