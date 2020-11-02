import { Category } from './category'
import { Schema } from '../utils/indexeddb'

export const cardSchema: Schema = {
  name: 'card',
  keyPath: 'name',
  indexes: [
    {
      field: 'name',
      unique: true,
    },
  ],
}

export class Card {
  public name?: string
  public description?: string
  public category?: Category
}
