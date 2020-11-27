import { Button, ButtonTypes } from '../components/button-bar'
import { CSSResult, PropertyValues, TemplateResult, css, customElement, html, property } from 'lit-element'
import { Card, CardEntity, Category, CategoryEntity } from '../schemas'
import { FooterButtonContent, FooterTypes } from '../layouts/layout-footer'

import MarkdownIt from 'markdown-it'
import { Page } from './page'
import { StatisticEntity } from '../schemas/statistic'
import { commonStyle } from '../assets/styles/common-style'
import { pageCommonStyle } from '../assets/styles/page-common-style'

const md: MarkdownIt = new MarkdownIt()

@customElement('page-training')
export class PageTraining extends Page {
  private guessButton: Button = {
    name: 'I guess...',
    type: ButtonTypes.Neutral,
    action: this.showDescription.bind(this),
  }

  private knewItButton: Button = {
    name: 'I Knew It!',
    type: ButtonTypes.Positive,
    action: this.knewIt.bind(this),
  }

  private didNotKnowButton: Button = {
    name: 'hmm...',
    type: ButtonTypes.Negative,
    action: this.didNotKnowIt.bind(this),
  }

  categoryIds: number[] = []

  @property({ type: Object }) category?: Category
  @property({ type: Object }) card?: Card
  @property({ type: Boolean }) openDescriptionCard: boolean = false
  @property({ type: Object }) footerContent?: FooterButtonContent = {
    type: FooterTypes.Button,
    buttons: [this.guessButton],
  }

  static get styles(): CSSResult[] {
    return [
      commonStyle,
      pageCommonStyle,
      css`
        .container {
          flex: 1;
          display: grid;
          grid-template-rows: 20vh 1fr;
          grid-gap: var(--theme-common-spacing, 5px);
        }
        .card {
          border-radius: var(--theme-common-radius, 5px);
        }
        .top-part {
          display: flex;
          background-color: white;
        }
        .category {
          color: var(--theme-darker-color);
          margin: var(--theme-common-spacing, 5px);
          font-style: italic;
          text-transform: capitalize;
          position: absolute;
        }
        .name {
          margin: auto;
          font-size: 5vh;
        }
        .bottom-part {
          position: relative;
          top: 100%;
          background-color: white;
          transition: top 0.3s ease-in-out;
          padding: var(--theme-common-spacing, 5px);
        }
        .bottom-part[opened] {
          top: 0;
          transition: top 0.3s ease-in-out;
        }
      `,
    ]
  }

  render(): TemplateResult {
    return html`<div class="container">
      <div class="top-part card">
        <span class="category">${this.category?.name}</span>
        <span class="name">${this.card?.name}</span>
      </div>
      <div id="description-card" class="bottom-part card" ?opened="${this.openDescriptionCard}"></div>
    </div>`
  }

  constructor() {
    super('Training', 'training')
  }

  get descCard(): HTMLDivElement | null {
    return this.renderRoot?.querySelector('#description-card')
  }

  pageUpdated(changedProps: PropertyValues) {
    if (changedProps.has('openDescriptionCard')) {
      if (this.openDescriptionCard) {
        this.footerContent = {
          type: FooterTypes.Button,
          buttons: [this.knewItButton, this.didNotKnowButton],
        }
      } else {
        this.footerContent = {
          type: FooterTypes.Button,
          buttons: [this.guessButton],
        }
      }

      this.dispatchFooterRendering()
    }
  }

  pageActivated(): void {
    if (this.params?.categoryIds) {
      this.categoryIds = JSON.parse(this.params.categoryIds)

      if (this.categoryIds?.length) {
        this.fetchCard()
      }
    }
  }

  private async fetchCard() {
    this.openDescriptionCard = false
    setTimeout(async () => {
      const categoryId: number = this.pickRandomly(this.categoryIds)
      const cards: Card[] = await new CardEntity().getCardsByCategoryId(categoryId)
      this.category = await new CategoryEntity().findOne(categoryId)
      this.card = this.pickRandomly(cards)
      this.renderMarkdown(this.card?.description)
    }, 300)
  }

  private renderMarkdown(description: string = '') {
    if (this.descCard) {
      this.descCard.innerHTML = md.render(description)
    }
  }

  private pickRandomly(items: any[]): any {
    if (items?.length) {
      const randomIdx: number = Math.floor(Math.random() * items.length)
      return items[randomIdx]
    }
  }

  private showDescription() {
    this.openDescriptionCard = true
  }

  private async knewIt() {
    try {
      await new StatisticEntity().save({
        card: this.card?.id as number,
        category: this.category?.id as number,
        passed: true,
      })
    } catch (e) {}

    this.fetchCard()
  }

  private async didNotKnowIt() {
    try {
      await new StatisticEntity().save({
        card: this.card?.id as number,
        category: this.category?.id as number,
        passed: false,
      })
    } catch (e) {}

    this.fetchCard()
  }
}
