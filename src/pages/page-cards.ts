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
        name: 'id',
        hidden: true,
      },
      {
        name: 'name',
        options: {
          required: true,
          listDisplayModifier: (card: Card) => `${card.name} - ${(card.category as Category).name}`,
        },
      },
      {
        name: 'category',
        options: {
          type: FieldTypes.Selector,
          options: categories,
          nameField: 'name',
          valueField: 'id',
          required: true,
          listDisplayModifier: (card: Card) => `${(card.category as Category).name}`,
          appendEmptyOption: false,
        },
      },
      {
        name: 'description',
        options: {
          type: FieldTypes.Markdown,
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
      const { id }: Card = new Card(e.detail.data)
      if (id) {
        await new CardEntity().delete(id)
        this.fetchCards()
      }
    } catch (e) {
      throw e
    }
  }
}
