import { Schema, TransactionHelper } from './transaction-helper'

import { CategoryEntity } from './category'

export const cardSchema: Schema = {
  name: 'card',
  indexes: [
    {
      field: 'name',
      unique: true,
    },
    {
      field: 'category',
    },
  ],
}
export class CardEntity extends TransactionHelper<CardEntity> {
  public readonly id?: string
  public name?: string
  public description?: string
  public category?: CategoryEntity

  constructor() {
    debugger
    super(cardSchema)
  }
}
