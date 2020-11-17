import { TemplateResult, customElement, html, property } from 'lit-element'

import { Card } from '../schemas'
import { Page } from './page'

@customElement('page-indexing')
export class PageIndexing extends Page {
  @property({ type: Array }) categoryIds: number[] = []
  @property({ type: Object }) card: Card | undefined = {}

  render(): TemplateResult {
    return html` <h2>Indexing</h2> `
  }

  constructor() {
    super('', 'indexing')
  }

  pageActivated(): void {
    this.categoryIds = history.state
    if (this.categoryIds?.length) {
      this.displayRandomCard()
    }
  }

  private displayRandomCard() {
    const categoryId: number = this.randomCategoryId()
  }

  private randomCategoryId(): number {
    if (this.categoryIds?.length) {
      const randomIdx: number = Math.floor(Math.random() * this.categoryIds.length)
      return this.categoryIds[randomIdx]
    } else {
      throw new Error('No category id list')
    }
  }
}
