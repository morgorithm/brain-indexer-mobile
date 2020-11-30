import { Schema, TransactionHelper } from './transaction-helper'

export class DailyChallenge {
  public id?: number
  public date: number
  public passed: boolean
  public rate: number

  constructor({ id, passed, rate }: DailyChallenge) {
    if (id) this.id = Number(id)
    this.date = Date.now()
    this.passed = Boolean(passed)
    this.rate = Number(rate)
  }
}

export const dailyChanllengeSchema: Schema = {
  name: 'dailyChanllenge',
  indexes: [
    {
      field: 'date',
    },
    {
      field: 'passed',
    },
    {
      field: 'rate',
    },
  ],
}

export class DailyChallengeEntity extends TransactionHelper<DailyChallenge> {
  protected schema: Schema = dailyChanllengeSchema
}
