import { Button, ButtonTypes } from '../components/button-bar'
import { CSSResult, TemplateResult, css, customElement, html, property } from 'lit-element'
import { Category, CategoryEntity, DailyChallenge, DailyChallengeEntity } from '../schemas'
import { FooterButtonContent, FooterTypes } from '../layouts/layout-footer'
import { ListFieldSet, SimpleDataList } from '../components/simple-data-list'

import { Page } from './page'
import { Router } from '../utils'
import { pageCommonStyle } from '../assets/styles/page-common-style'
import { showToast } from '../components/toast-message'

@customElement('page-home')
export class PageHome extends Page {
  private challengeButton: Button = {
    type: ButtonTypes.Negative,
    name: 'challenge',
    icon: 'military_tech',
    action: () => new Router().navigate('Chanllenge', 'challenge'),
  }

  @property({ type: Boolean }) isHomePage: boolean = true
  @property({ type: Object }) fieldSet: ListFieldSet = {
    keyField: {
      name: 'nameAndCount',
    },
  }
  @property({ type: Array }) data: Record<string, any>[] = []
  @property({ type: Array }) selectedData: Record<string, any>[] = []

  @property({ type: Object }) footerContent?: FooterButtonContent

  static get styles(): CSSResult[] {
    return [pageCommonStyle]
  }

  render(): TemplateResult {
    const fieldSet: ListFieldSet = this.fieldSet || {}
    const data: Record<string, any>[] = this.data || []

    return html`<simple-data-list
      .fillterable="${false}"
      .title="${this.title}"
      .fieldSet="${fieldSet}"
      .data="${data}"
      selectable
      @selectedItemChanged="${this.selectedItemChanged}"
    ></simple-data-list>`
  }

  constructor() {
    super('Brain Indexing', '')
  }

  get dataList(): SimpleDataList | null {
    return this.renderRoot.querySelector('simple-data-list')
  }

  async pageActivated(): Promise<void> {
    this.footerContent = {
      type: FooterTypes.Button,
      buttons: (await new DailyChallengeEntity().checkTodayChallenge()) ? [] : [this.challengeButton],
    }
    this.dispatchFooterRendering()
    await this.fetchCategories()
  }

  async checkTodayChallenge(): Promise<boolean> {
    return await new DailyChallengeEntity().checkTodayChallenge()
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

    debugger
    this.selectedItemChanged()
  }

  async selectedItemChanged(): Promise<void> {
    const selectedCategories: Record<string, any>[] = this.dataList?.selectedData || []

    this.footerContent = {
      type: FooterTypes.Button,
      buttons: (await new DailyChallengeEntity().checkTodayChallenge()) ? [] : [this.challengeButton],
    }

    if (selectedCategories.length) {
      const categoryIds: number[] = selectedCategories.map((category: Record<string, any>) => category.id)
      this.footerContent?.buttons.push({
        type: ButtonTypes.Positive,
        name: 'training',
        icon: 'school',
        action: () => new Router().navigate('Training', `training`, { categoryIds }),
      })
    }

    this.dispatchFooterRendering()
  }
}
