import '@material/mwc-icon'

import { CSSResult, LitElement, TemplateResult, css, customElement, html, property } from 'lit-element'

import { commonStyle } from '../assets/styles/common-style'

@customElement('layout-header')
export class LayoutHeader extends LitElement {
  @property({ type: String }) title: string = 'Brain Indexer'

  static get styles(): CSSResult[] {
    return [
      commonStyle,
      css`
        .header {
          display: grid;
          grid-template-columns: 10vw 1fr 10vw;
          border-bottom: 1px solid var(--theme-darker-color);
        }
        .header > div {
          display: flex;
          margin: auto;
          color: white;
          font-weight: bold;
        }
        .edge > mwc-icon {
          margin: auto;
        }
        .center {
          padding: 10px;
        }
        .center > .page-title {
          margin: 5px;
          font-size: larger;
          font-weight: bold;
        }
      `,
    ]
  }

  render(): TemplateResult {
    return html`
      <div class="header">
        <div
          class="left edge"
          @click="${() => {
            this.dispatchEvent(new CustomEvent('menuIconClick'))
          }}"
        >
          <mwc-icon>menu</mwc-icon>
        </div>

        <div class="center">
          <span class="page-title"> ${this.title} </span>
        </div>

        <div class="right edge"></div>
      </div>
    `
  }

  constructor() {
    super()
    document.addEventListener('after-navigate', this.onAfterNavicate.bind(this))
  }

  onAfterNavicate(event: Event) {
    const { title }: { title: string } = (event as CustomEvent).detail
    if (title) {
      this.title = title
    }
  }
}
