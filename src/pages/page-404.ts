import { CSSResult, TemplateResult, css, customElement, html, property } from 'lit-element'

import { Page } from './page'
import { commonStyle } from '../assets/styles/common-style'

@customElement('page-404')
export class Page404 extends Page {
  @property({ type: Boolean }) isPageNotFound: boolean = true

  static get styles(): CSSResult[] {
    return [
      commonStyle,
      css`
        :host {
          color: white;
          font-size: x-large;
          display: flex;
        }
        #message-box {
          flex: 1;
        }
        #message-box > {
          margin: auto;
        }
      `,
    ]
  }

  render(): TemplateResult {
    return html`
      <div id="message-box">
        <h1>404</h1>
        <h4>Page Not Found</h4>
      </div>
    `
  }

  constructor() {
    super('Page Not Found', '404', true)
  }
}
