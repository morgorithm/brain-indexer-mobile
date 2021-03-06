import { css, CSSResult, customElement, html, property, PropertyValues, TemplateResult } from 'lit-element'
import MarkdownIt from 'markdown-it'
import { commonStyle } from '../assets/styles/common-style'
import { pageCommonStyle } from '../assets/styles/page-common-style'
import { Button, ButtonTypes } from '../components/button-bar'
import '../components/progress-bar'
import { showToast, ToastMessageTypes } from '../components/toast-message'
import { FooterButtonContent, FooterTypes } from '../layouts/layout-footer'
import { Card, CardEntity, Category, DailyChallengeEntity } from '../schemas'
import { Router } from '../utils'
import { Page } from './page'

const md: MarkdownIt = new MarkdownIt()
@customElement('page-challenge')
export class PageChallenge extends Page {
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

  @property({ type: Object }) category?: Category
  @property({ type: Object }) card?: Card
  @property({ type: Boolean }) openDescriptionCard: boolean = false
  @property({ type: Object }) footerContent?: FooterButtonContent = {
    type: FooterTypes.Button,
    buttons: [this.guessButton],
  }

  @property({ type: Number }) score: number = 0

  @property({ type: Number }) level: number = 1
  @property({ type: Number }) goalLevel: number = 20

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
        .dashboard {
          display: flex;
          flex-direction: column;
          background-color: white;
          padding: var(--theme-common-spacing, 5px);
          border-radius: var(--theme-common-radius, 5px);
        }
        .dashboard > .inner-board {
          display: flex;
        }
        .inner-board > mwc-icon {
          margin-right: var(--theme-common-spacing, 5px);
          color: var(--theme-dark-color);
        }
        .inner-board span.label {
          font-weight: bold;
          color: var(--theme-dark-color);
          margin: auto 0;
        }
        .inner-board span.value {
          font-weight: bolder;
          color: var(--theme-darker-color);
          margin: auto var(--theme-common-spacing, 5px) auto auto;
        }
        .inner-board progress-bar {
          flex: 1;
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
      <div class="dashboard">
        <div class="inner-board">
          <mwc-icon>school</mwc-icon>
          <progress-bar .rate="${Number((((this.level - 1) / this.goalLevel) * 100).toFixed())}"></progress-bar>
        </div>

        <div class="inner-board">
          <mwc-icon>fact_check</mwc-icon>
          <span class="label">Score</span>
          <span class="value">${this.score ? '+' : ''}${this.score}</span>
        </div>
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
    this.fetchCard()
  }

  private async fetchCard() {
    const remainNumber: number = this.goalLevel - (this.level - 1)
    if (!remainNumber) return
    await this.showRemainNumber(remainNumber)

    this.openDescriptionCard = false
    setTimeout(async () => {
      const cards: Card[] = await new CardEntity().find()
      this.card = this.pickRandomly(cards)
      this.category = this.card?.category as Category
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
    this.score++

    if (this.level === this.goalLevel) {
      this.checkResult()
    } else {
      this.level++
      this.fetchCard()
    }
  }

  private async didNotKnowIt() {
    if (this.level === this.goalLevel) {
      this.checkResult()
    } else {
      this.level++
      this.fetchCard()
    }
  }

  private checkResult(): void {
    const passRate: number = Number(((this.score / this.goalLevel) * 100).toFixed())

    if (passRate >= 90) {
      new DailyChallengeEntity().save({
        rate: passRate,
        passed: true,
      })

      showToast({
        type: ToastMessageTypes.Info,
        subtitle: `Congraturation!`,
        message: `You've passed Daily Challenge!`,
      })
    } else {
      new DailyChallengeEntity().save({
        rate: passRate,
        passed: false,
      })

      showToast({
        type: ToastMessageTypes.Warn,
        subtitle: `Cheer up!`,
        message: `You've failed Daily Challenge...`,
      })
    }

    this.level = 1
    new Router().navigate('Brain Indexing', '')
  }

  private async showRemainNumber(remainNumber: number): Promise<void> {
    if (this.goalLevel === remainNumber) {
      showToast({
        type: ToastMessageTypes.Info,
        subtitle: `Let's start today's daily challenge!`,
        message: `${remainNumber} random cards are waiting for you!`,
        interval: 3,
      })

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, 3500)
      })
    } else {
      switch (remainNumber) {
        case 10:
          showToast({
            type: ToastMessageTypes.Info,
            message: `Cheer up! ${remainNumber} cards left to go!`,
          })
          break

        case 5:
          showToast({
            type: ToastMessageTypes.Info,
            message: `Almost there only ${remainNumber} cards left to go!`,
          })
          break

        case 1:
          showToast({
            type: ToastMessageTypes.Info,
            message: `Last one!`,
          })
          break
      }
    }
  }
}
