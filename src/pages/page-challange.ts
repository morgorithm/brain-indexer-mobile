import { CSSResult, PropertyValues, TemplateResult, css, customElement, html, property } from 'lit-element'
import { Card, CardEntity, Category } from '../schemas'
import { FooterButtonContent, FooterTypes } from '../layouts/layout-footer'

import { ButtonTypes } from '../components/button-bar'
import { Page } from './page'
import { commonStyle } from '../assets/styles/common-style'
import { pageCommonStyle } from '../assets/styles/page-common-style'

@customElement('page-challenge')
export class PageChallenge extends Page {
  @property({ type: Object }) category?: Category
  @property({ type: Object }) card?: Card
  @property({ type: Boolean }) openDescriptionCard: boolean = false
  @property({ type: Object }) footerContent?: FooterButtonContent

  @property({ type: Number }) score: number = 0
  @property({ type: Number }) totalScore: number = 0

  static get styles(): CSSResult[] {
    return [
      commonStyle,
      pageCommonStyle,
      css`
        .container {
          flex: 1;
          display: grid;
          grid-template-rows: auto 20vh 1fr;
          grid-gap: var(--theme-common-spacing, 5px);
        }
        .score-board {
          margin-left: auto;
          display: flex;
          background-color: white;
          padding: var(--theme-common-spacing, 5px);
          border-radius: var(--theme-common-radius, 5px);
        }
        .score-board > span {
          color: var(--theme-darker-color);
        }
        .score-board > span.label {
          font-weight: bold;
          margin-left: auto;
        }
        .score-board > span.score {
          margin: auto 0 auto var(--theme-common-spacing, 5px);
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
      <div class="score-board">
        <span>Score</span>
        <span class="score">${this.score}/${this.totalScore}</span>
      </div>

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
    super('Challenge', 'challenge')
  }

  pageUpdated(changedProps: PropertyValues) {
    if (changedProps.has('openDescriptionCard')) {
      if (this.openDescriptionCard) {
        this.footerContent = {
          type: FooterTypes.Button,
          buttons: [
            {
              name: 'I Knew It!',
              type: ButtonTypes.Positive,
              action: this.knewIt.bind(this),
            },
            {
              name: 'hmm...',
              type: ButtonTypes.Negative,
              action: this.didNotKnowIt.bind(this),
            },
          ],
        }
      } else {
        this.footerContent = {
          type: FooterTypes.Button,
          buttons: [
            {
              name: 'I guess...',
              type: ButtonTypes.Neutral,
              action: this.showDescription.bind(this),
            },
          ],
        }
      }

      this.dispatchFooterRendering()
    }
  }

  pageActivated(): void {
    this.fetchCard()
  }

  private async fetchCard() {
    this.openDescriptionCard = false
    await this.updateComplete
    const cards: Card[] = await new CardEntity().find()
    this.card = this.pickRandomly(cards)
    this.category = this.card?.category as Category
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

  private knewIt() {
    this.score++
    this.totalScore++
    this.fetchCard()
  }

  private didNotKnowIt() {
    this.score--
    this.totalScore++
    this.fetchCard()
  }
}
