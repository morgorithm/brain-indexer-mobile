import { css, CSSResult, customElement, html, TemplateResult } from 'lit-element'
import { commonStyle } from '../assets/styles/common-style'
import { pageCommonStyle } from '../assets/styles/page-common-style'
import { showToast, ToastMessageTypes } from '../components/toast-message'
import { Card, CardEntity, Category, CategoryEntity, DailyChallengeEntity, StatisticEntity } from '../schemas'
import { Page } from './page'

@customElement('page-settings')
export class PageSettings extends Page {
  static get styles(): CSSResult[] {
    return [
      pageCommonStyle,
      commonStyle,
      css`
        .button-pannel {
          display: grid;
          grid-template-columns: 1fr;
          background-color: white;
          border-radius: var(--theme-common-radius, 5px);
          padding: var(--theme-wide-spacing, 10pxs);
        }
        .button-pannel > * {
          border-bottom: 1px solid var(--theme-darker-color);
          padding: var(--theme-common-spacing, 5px);
        }
        .single-row {
          flex: 1;
          display: flex;
        }
        .button-pannel > *:last-child {
          border-bottom: none;
        }
        button {
          margin-left: auto;
        }
      `,
    ]
  }

  constructor() {
    super('Settings', 'settings')
  }

  render(): TemplateResult {
    return html`<div class="button-pannel">
      <div class="single-row">
        <label>Clear Statistics</label>
        <button class="negative" @click="${this.clearStatistics}">
          <mwc-icon>delete_forever</mwc-icon><span>Clear</span>
        </button>
      </div>

      <div class="single-row">
        <label>Clear Daily Achievment</label>
        <button class="negative" @click="${this.clearDailyAchivement}">
          <mwc-icon>delete_forever</mwc-icon><span>Clear</span>
        </button>
      </div>

      <div class="single-row">
        <label>Export Data</label>
        <button class="positive" @click="${this.exportData}">
          <mwc-icon>import_export</mwc-icon><span>Export</span>
        </button>
      </div>

      <div class="single-row">
        <label>Import Data</label>
        <button class="positive" @click="${this.importData}">
          <mwc-icon>import_export</mwc-icon><span>Import</span>
        </button>
      </div>
    </div>`
  }

  private async clearStatistics(): Promise<void> {
    await new StatisticEntity().deleteAll()
    showToast({
      type: ToastMessageTypes.Info,
      message: 'Statistics have been cleared successfully.',
    })
  }

  private async clearDailyAchivement(): Promise<void> {
    await new DailyChallengeEntity().deleteAll()
    showToast({
      type: ToastMessageTypes.Info,
      message: 'Daily Achivement has been cleared successfully.',
    })
  }

  private async exportData(): Promise<void> {
    let cards: Card[] = await new CardEntity().find()

    cards = cards.map((card: Card) => {
      delete (card.category as Category).id
      delete card.id
      return card
    })

    console.log('TODO: Export data')
  }

  private async importData(): Promise<void> {
    console.log('TODO: Import data')
  }
}
