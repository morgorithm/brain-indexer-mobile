import { CSSResult, TemplateResult, css, customElement, html, property } from 'lit-element'
import { Card, CardEntity, Category, CategoryEntity } from '../schemas'
import { ToastMessageTypes, showToast } from '../components/toast-message'

import { Field } from '../components/crud-data-list'
import { FieldTypes } from '../components/form-popup'
import { Page } from './page'
import { commonStyle } from '../assets/styles/common-style'
import { pageCommonStyle } from '../assets/styles/page-common-style'

@customElement('page-cards')
export class PageCards extends Page {
  @property({ type: Array }) fields: Field[] = []
  @property({ type: Array }) data: Record<string, any>[] = []

  static get styles(): CSSResult[] {
    return [commonStyle, pageCommonStyle]
  }

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
      showToast({
        subtitle: 'card has been created',
        message: `'${card.name}' is created successfully`,
        type: ToastMessageTypes.Info,
      })
    } catch (e) {
      showToast({
        subtitle: 'failed to save card',
        message: e.message,
        type: ToastMessageTypes.Warn,
      })
    }
  }

  async deleteCard(e: CustomEvent): Promise<void> {
    try {
      const { id, name }: Card = new Card(e.detail.data)
      if (id) {
        await new CardEntity().delete(id)
        this.fetchCards()
        showToast({
          subtitle: 'card has been deleted',
          message: `'${name}' is deleted successfully`,
          type: ToastMessageTypes.Info,
        })
      }
    } catch (e) {
      showToast({
        subtitle: 'failed to delete card',
        message: e.message,
        type: ToastMessageTypes.Error,
      })
    }
  }
}
