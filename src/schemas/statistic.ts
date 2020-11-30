import { RelationType, Schema, TransactionHelper } from './transaction-helper'

import { Card } from './card'
import { Category } from './category'

export class Statistic {
  public id?: number
  public category: Category | number
  public card: Card | number
  public passed: boolean
  public storedAt?: number

  constructor({ id, category, card, passed, storedAt }: Statistic) {
    if (id) this.id = Number(id)
    this.category = category instanceof Category ? category : Number(category)
    this.card = card instanceof Card ? card : Number(card)
    this.passed = Boolean(passed)
    this.storedAt = storedAt || Date.now()
  }
}

export const statisticSchema: Schema = {
  name: 'statistic',
  indexes: [
    {
      field: 'category',
      reference: {
        relationType: RelationType.ManyToOne,
      },
    },
    {
      field: 'card',
      reference: {
        relationType: RelationType.ManyToOne,
      },
    },
    {
      field: 'passed',
    },
    {
      field: 'storedAt',
    },
  ],
}

export class StatisticEntity extends TransactionHelper<Statistic> {
  protected schema: Schema = statisticSchema

  protected async beforeSave(data: Statistic): Promise<Statistic> {
    data.storedAt = data.storedAt || Date.now()
    return data
  }
}
