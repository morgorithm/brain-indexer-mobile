import { Button, ButtonTypes } from '../components/button-bar'
import { CSSResult, PropertyValues, TemplateResult, css, customElement, html, property } from 'lit-element'
import { Card, CardEntity, Category, CategoryEntity } from '../schemas'
import { FooterButtonContent, FooterTypes } from '../layouts/layout-footer'

import { Page } from './page'
import { commonStyle } from '../assets/styles/common-style'

@customElement('page-training')
export class PageTraining extends Page {
  private guessButton: Button = {
    icon: 'sentiment_dissatisfied',
    name: 'I guess...',
    type: ButtonTypes.Neutral,
    action: this.showDescription.bind(this),
  }

  private knewItButton: Button = {
    icon: 'mood',
    name: 'I Knew It!',
    type: ButtonTypes.Positive,
    action: this.knewIt.bind(this),
  }

  private didNotKnowButton: Button = {
    icon: 'mood_bad',
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
      css`
        :host {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
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
          opacity: 0%;
          background-color: white;
        }
        .bottom-part[opened] {
          opacity: 100%;
          transition: opacity 0.3s ease-in-out;
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
      <div class="bottom-part card" ?opened="${this.openDescriptionCard}">
        <span class="description">${this.card?.description}</span>
      </div>
    </div>`
  }

  constructor() {
    super('Training', 'training')
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
    await this.updateComplete
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

  private showDescription() {
    console.log(this)
    this.openDescriptionCard = true
  }

  private knewIt() {
    this.fetchCard()
  }

  private didNotKnowIt() {
    this.fetchCard()
  }
}
