import { Card, CardEntity, Category, CategoryEntity } from '../schemas'
import { TemplateResult, customElement, html, property } from 'lit-element'

import { Page } from './page'

@customElement('page-indexing')
export class PageIndexing extends Page {
  categoryIds: number[] = []
  @property({ type: Object }) category?: Category

  @property({ type: Object }) card?: Card

  render(): TemplateResult {
    return html`<div>
      <span class="category">${this.category?.name}</span>
      <span class="name">${this.card?.name}</span>
    </div>`
  }

  constructor() {
    super('indexing')
  }

  pageActivated(): void {
    this.categoryIds = JSON.parse(this.params?.categoryIds)

    if (this.categoryIds?.length) {
      this.fetchCard()
    }
  }

  private async fetchCard() {
    const categoryId: number = this.pickRandomly(this.categoryIds)
    const cards: Card[] = await new CardEntity().getCardsByCategoryId(categoryId)
    this.category = await new CategoryEntity().findOne(categoryId)
    this.card = this.pickRandomly(cards)
  }

  private pickRandomly(items: any[]): any {
    if (items?.length) {
      const randomIdx: number = Math.floor(Math.random() * items.length)
      return items[randomIdx]
    }
  }
}
