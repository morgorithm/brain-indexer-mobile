import { TemplateResult, customElement, html } from 'lit-element'

import { Page } from './page'

@customElement('page-cards')
export class PageCards extends Page {
  render(): TemplateResult {
    return html` <h2>Page Cards</h2> `
  }

  constructor() {
    super('Cards', 'cards')
  }
}
