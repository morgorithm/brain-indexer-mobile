import '../components/simple-data-table'

import { CSSResult, TemplateResult, css, customElement, html, property } from 'lit-element'

import { Page } from './page'

@customElement('page-home')
export class PageHome extends Page {
  @property({ type: Array }) fields: string[] = ['category', 'qty']
  @property({ type: Array }) data: Record<string, any>[] = [
    {
      category: 'Computer Science',
      qty: 10,
    },
  ]

  static get styles(): CSSResult[] {
    return [
      css`
        :host {
          flex: 1;
          display: flex;
          overflow: auto;
        }
      `,
    ]
  }

  render(): TemplateResult {
    const fields: string[] = this.fields || []
    const data: Record<string, any>[] = this.data || []

    return html`<simple-data-table .fields="${fields}" .data="${data}" selectable editable></simple-data-table>`
  }

  constructor() {
    super('Brain Indexer', '')
  }
}
