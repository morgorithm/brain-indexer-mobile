import { Schema } from '../utils/indexeddb'

export const categorySchema: Schema = {
  name: 'category',
  keyPath: 'name',
  indexes: [
    {
      field: 'name',
      unique: true,
    },
  ],
}

export class Category {
  public name?: string
  public readonly itemCnt: number = 0
}
