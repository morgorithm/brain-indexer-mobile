import { RelationType, Schema, TransactionHelper } from './transaction-helper'

import { Card } from './card'
import { Category } from './category'

export class Statistic {
  public id?: number
  public category: Category | number
  public card: Card | number
  public passed: boolean
  public year?: number
  public month?: number
  public dateStr?: string

  constructor({ id, category, card, passed }: Statistic) {
    if (id) this.id = Number(id)
    this.category = category instanceof Category ? category : Number(category)
    this.card = card instanceof Card ? card : Number(card)
    this.passed = Boolean(passed)
    let today: Date = new Date()
    today.setHours(0, 0, 0, 0)
    this.year = today.getFullYear()
    this.month = today.getMonth() + 1
    this.dateStr = `${this.year}-${this.month}`
  }
}

export const statisticSchema: Schema = {
  name: 'statistic',
  indexes: [
    { field: 'category', reference: { relationType: RelationType.ManyToOne } },
    { field: 'card', reference: { relationType: RelationType.ManyToOne } },
    { field: 'passed' },
    { field: 'year' },
    { field: 'month' },
    { field: 'dateStr' },
  ],
}

export class StatisticEntity extends TransactionHelper<Statistic> {
  protected schema: Schema = statisticSchema

  protected async beforeSave(data: Statistic): Promise<Statistic> {
    if (!data.dateStr) {
      let today: Date = new Date()
      today.setHours(0, 0, 0, 0)
      data.year = today.getFullYear()
      data.month = today.getMonth() + 1
      data.dateStr = `${data.year}-${data.month}`
    }
    return data
  }

  public async deleteAll(): Promise<void> {
    const objectStore: IDBObjectStore = await this.getObejctStore('readwrite')
    const request: IDBRequest = objectStore.clear()
    await this.commonResultHandler(request)
  }
}
