import { Category, CategoryEntity } from './category'
import { RelationType, Schema, TransactionHelper } from './transaction-helper'

export class Card {
  public id?: number
  public name?: string
  public description?: string
  public category?: Category | number

  constructor({ id, name, description, category }: Card) {
    if (id) this.id = Number(id)
    if (name) this.name = name
    if (description) this.description = description
    if (category) this.category = category instanceof Category ? category : Number(category)
  }
}

export const cardSchema: Schema = {
  name: 'card',
  indexes: [
    {
      field: 'name',
      unique: true,
    },
    {
      field: 'category',
      reference: {
        relationType: RelationType.ManyToOne,
      },
    },
  ],
}

export class CardEntity extends TransactionHelper<Card> {
  protected schema: Schema = cardSchema
}
