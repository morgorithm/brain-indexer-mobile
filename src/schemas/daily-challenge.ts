import { Schema, TransactionHelper } from './transaction-helper'

export class DailyChallenge {
  public id?: number
  public year?: number
  public month?: number
  public date?: number
  public dateStr?: string
  public passed: boolean
  public rate: number

  constructor({ id, passed, rate }: DailyChallenge) {
    if (id) this.id = Number(id)
    let today: Date = new Date()
    today.setHours(0, 0, 0, 0)
    this.year = today.getFullYear()
    this.month = today.getMonth() + 1
    this.date = today.getDate()
    this.dateStr = `${this.year}-${this.month}-${this.date}`
    this.passed = Boolean(passed)
    this.rate = Number(rate)
  }
}

export const dailyChanllengeSchema: Schema = {
  name: 'dailyChanllenge',
  indexes: [
    { field: 'year' },
    { field: 'month' },
    { field: 'date' },
    { field: 'dateStr' },
    { field: 'passed' },
    { field: 'rate' },
  ],
}

export class DailyChallengeEntity extends TransactionHelper<DailyChallenge> {
  protected schema: Schema = dailyChanllengeSchema

  protected async beforeSave(data: DailyChallenge): Promise<DailyChallenge> {
    if (!data.dateStr) {
      let today: Date = new Date()
      today.setHours(0, 0, 0, 0)
      data.year = today.getFullYear()
      data.month = today.getMonth() + 1
      data.date = today.getDate()
      data.dateStr = `${data.year}-${data.month}-${data.date}`
    }

    return data
  }

  public async checkTodayChallenge(): Promise<boolean> {
    let today: Date = new Date()
    today.setHours(0, 0, 0, 0)
    const year: number = today.getFullYear()
    const month: number = today.getMonth() + 1
    const date: number = today.getDate()
    const dateStr: string = `${year}-${month}-${date}`

    const objectStore: IDBObjectStore = await this.getObejctStore('readonly')
    const request: IDBRequest = objectStore.index('dateStr').get(dateStr)
    const todayChallenge: DailyChallenge = await this.commonResultHandler(request)

    return Boolean(todayChallenge)
  }

  public async deleteAll(): Promise<void> {
    const objectStore: IDBObjectStore = await this.getObejctStore('readwrite')
    const request: IDBRequest = objectStore.clear()
    await this.commonResultHandler(request)
  }
}
