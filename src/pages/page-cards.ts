import { Card, CardEntity, Category, CategoryEntity } from '../schemas'
import { TemplateResult, customElement, html, property } from 'lit-element'

import { Field } from '../components/crud-data-list'
import { FieldTypes } from '../components/form-popup'
import { Page } from './page'

@customElement('page-cards')
export class PageCards extends Page {
  @property({ type: Array }) fields: Field[] = []
  @property({ type: Array }) data: Record<string, any>[] = []

  render(): TemplateResult {
    const fields: Field[] = this.fields || []
    const data: Record<string, any>[] = this.data || []

    return html` <crud-data-list
      .title="${this.title}"
      .fields="${fields}"
      .data="${data}"
      @saveButtonClick="${this.saveCard}"
      @deleteButtonClick="${this.deleteCard}"
    ></crud-data-list>`
  }

  constructor() {
    super('Cards', 'cards')
  }

  async pageActivated(): Promise<void> {
    const categories: Category[] = await new CategoryEntity().find()
    this.fields = [
      {
        name: 'name',
        options: {
          required: true,
        },
      },
      {
        name: 'category',
        options: {
          type: FieldTypes.Selector,
          options: categories.map((c: Category) => {
            const { id, name }: Category = c
            return { name: name as string, value: id }
          }),
          required: true,
        },
      },
      {
        name: 'description',
        options: {
          type: FieldTypes.Textarea,
          required: true,
        },
      },
    ]
    await this.fetchCards()
  }

  async fetchCards(): Promise<void> {
    this.data = await new CardEntity().find()
  }

  async saveCard(e: CustomEvent): Promise<void> {
    try {
      const card: Card = new Card(e.detail.data)
      await new CardEntity().save(card)
      this.fetchCards()
    } catch (e) {
      throw e
    }
  }

  async deleteCard(e: CustomEvent): Promise<void> {
    try {
      const { name }: Card = new Card(e.detail.data)
      if (name) {
        await new CardEntity().delete(name)
        this.fetchCards()
      }
    } catch (e) {
      throw e
    }
  }
}
