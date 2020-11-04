import { CSSResult, LitElement, TemplateResult, css, customElement, html, property } from 'lit-element'

import { Page } from '../pages/page'
import { commonStyle } from '../assets/styles/common-style'

@customElement('layout-content')
export class LayoutContent extends LitElement {
  @property({ type: String }) title: string = ''
  @property({ type: String }) route: string = ''
  @property({ type: Object }) activatedPage: object | null = null

  static get styles(): CSSResult[] {
    return [
      commonStyle,
      css`
        :host {
          margin: var(--theme-common-margin, 5px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
      `,
    ]
  }

  render(): TemplateResult {
    return html`<main><slot></slot></main>`
  }

  constructor() {
    super()
    document.addEventListener('after-navigate', this.onAfterNavigate.bind(this))
  }

  get pages(): Page[] {
    return Array.from(this.children) as Page[]
  }

  get page404(): Page | undefined {
    return this.pages.find((page: Page) => page.isFallbackPage)
  }

  onAfterNavigate(e: Event): void {
    const { title, route } = (e as CustomEvent).detail

    this.hideAllPages()

    const page: Page | undefined = this.pages.find((page: Page) => page.route === route)
    if (page) {
      page.showPage()
    } else {
      if (this.page404) {
        this.page404.showPage()
      } else {
        console.warn('Page not found')
      }
    }
  }

  hideAllPages() {
    this.pages.forEach((page: Page) => page.hidePage())
  }
}
