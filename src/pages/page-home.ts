import { CSSResult, TemplateResult, css, customElement, html, property } from 'lit-element'
import { Category, CategoryEntity } from '../schemas'
import { FooterButtonContent, FooterTypes } from '../layouts/layout-footer'
import { ListFieldSet, SimpleDataList } from '../components/simple-data-list'

import { ButtonTypes } from '../components/button-bar'
import { Page } from './page'
import { Router } from '../utils'

@customElement('page-home')
export class PageHome extends Page {
  @property({ type: Object }) fieldSet: ListFieldSet = {
    keyField: {
      name: 'nameAndCount',
    },
  }
  @property({ type: Array }) data: Record<string, any>[] = []

  @property({ type: Array }) selectedData: Record<string, any>[] = []

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
      @selectedItemChanged="${this.selectedItemChanged}"
    ></simple-data-list>`
  }

  constructor() {
    super('Brain Indexer', '')
  }

  get dataList(): SimpleDataList | null {
    return this.renderRoot.querySelector('simple-data-list')
  }

  async pageActivated(): Promise<void> {
    await this.fetchCategories()
  }

  async fetchCategories(): Promise<void> {
    const data: Category[] = await new CategoryEntity().find()
    this.data = data
      .filter((category: Category) => category.itemCnt)
      .map((category: Category) => {
        return {
          id: category.id,
          nameAndCount: `${category.name} (${category.itemCnt || 0})`,
        }
      })
  }

  selectedItemChanged(): void {
    const selectedCategories: Record<string, any>[] = this.dataList?.selectedData || []
    if (selectedCategories.length) {
      const categoryIds: number[] = selectedCategories.map((category: Record<string, any>) => category.id)
      const footerButtonContent: FooterButtonContent = {
        type: FooterTypes.Button,
        buttons: [
          {
            type: ButtonTypes.Positive,
            name: 'start',
            icon: 'school',
            action: () => new Router().navigate('', 'indexing', categoryIds),
          },
        ],
      }
      this.renderFooterButtons(footerButtonContent)
    } else {
      this.renderFooterButtons()
    }
  }

  renderFooterButtons(content?: FooterButtonContent): void {
    document.dispatchEvent(
      new CustomEvent('render-footer-content', {
        detail: { content },
      })
    )
  }
}
