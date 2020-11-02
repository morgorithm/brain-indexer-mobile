import { TemplateResult, customElement, html, property } from 'lit-element'

import { Page } from './page'

@customElement('page-categories')
export class PageCategories extends Page {
  @property({ type: Array }) fields: string[] = ['category', 'qty']
  @property({ type: Array }) data: Record<string, any>[] = [
    {
      category: 'Computer Science',
      qty: 10,
    },
  ]

  render(): TemplateResult {
    const fields: string[] = this.fields || []
    const data: Record<string, any>[] = this.data || []

    return html`<simple-data-table .fields="${fields}" .data="${data}" appendable></simple-data-table>`
  }

  constructor() {
    super('Categories', 'categories')
  }
}
