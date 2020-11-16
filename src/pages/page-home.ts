import { CSSResult, TemplateResult, css, customElement, html, property } from 'lit-element'
import { Category, CategoryEntity } from '../schemas'

import { ListFieldSet } from '../components/simple-data-list'
import { Page } from './page'

@customElement('page-home')
export class PageHome extends Page {
  @property({ type: Array }) fieldSet: ListFieldSet = {
    keyField: {
      name: 'nameAndCount',
    },
  }
  @property({ type: Array }) data: Record<string, any>[] = []

  static get styles(): CSSResult[] {
    return [
      css`
        :host {
          flex: 1;
          display: flex;
          overflow: auto;
        }
        simple-data-list {
          flex: 1;
        }
      `,
    ]
  }

  render(): TemplateResult {
    const fieldSet: ListFieldSet = this.fieldSet || {}
    const data: Record<string, any>[] = this.data || []

    return html`<simple-data-list
      .title="${this.title}"
      .fieldSet="${fieldSet}"
      .data="${data}"
      selectable
    ></simple-data-list>`
  }

  constructor() {
    super('Brain Indexer', '')
  }

  async pageActivated(): Promise<void> {
    await this.fetchCategories()
  }

  async fetchCategories(): Promise<void> {
    const data: Category[] = await new CategoryEntity().find()
    this.data = data.map((category: Category) => {
      return {
        nameAndCount: `${category.name} (${category.itemCnt || 0})`,
      }
    })
  }
}
