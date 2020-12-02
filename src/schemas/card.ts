import { Category, CategoryEntity } from './category'
import { RelationType, Schema, TransactionHelper } from './transaction-helper'

export class Card {
  public id?: number
  public name: string
  public description: string
  public category: Category | number

  constructor({ id, name, description, category }: Card) {
    if (id) this.id = Number(id)
    this.name = name
    this.description = description
    this.category = category instanceof Category ? category : Number(category)
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
    {
      field: 'description',
    },
  ],
}

export class CardEntity extends TransactionHelper<Card> {
  protected schema: Schema = cardSchema

  protected async afterRead(data: Card | Card[]): Promise<Card | Card[]> {
    if (Array.isArray(data)) {
      data.sort((a: Card, b: Card) => {
        if (a.name && b.name) {
          if (a.name > b.name) return 1
          if (a.name < b.name) return -1
          return 0
        } else {
          return 0
        }
      })
    }
    return data
  }

  protected async afterSave(createdKey: number): Promise<Card> {
    const card: Card = await this.findOne(createdKey)
    const categoryId: number = card.category as number
    const category: Category = await new CategoryEntity().findOne(categoryId)
    if (!category.itemCnt) {
      category.itemCnt = 1
    } else {
      category.itemCnt++
    }

    await new CategoryEntity().save(category)
    return card
  }

  protected async beforeDelete(key: number): Promise<void> {
    const card: Card = await this.findOne(key)
    const categoryId: number = card.category as number
    const category: Category = await new CategoryEntity().findOne(categoryId)
    if (category.itemCnt) {
      category.itemCnt--
    }
    await new CategoryEntity().save(category)
  }

  async getCardsByCategoryId(categoryId: number): Promise<Card[]> {
    const objectStore: IDBObjectStore = await this.getObejctStore('readonly')
    const request: IDBRequest = objectStore.index('category').getAll(categoryId)
    return await this.commonResultHandler(request)
  }
}
