import { CSSResult, LitElement, css, property } from 'lit-element'
import { FooterButtonContent, FooterMessageContent } from '../layouts/layout-footer'

import { Router } from '../utils'
import { commonStyle } from '../assets/styles/common-style'

export interface PageInfo {
  title: string
  route: string
  params?: Record<string, any>
  footerContent?: FooterButtonContent | FooterMessageContent
  isFallbackPage?: boolean
}

export class Page extends LitElement implements PageInfo {
  @property({ type: String }) title: string = ''
  @property({ type: String }) route: string
  @property({ type: Object }) params?: Record<string, any>
  @property({ type: Object }) footerContent?: FooterButtonContent | FooterMessageContent
  @property({ type: Boolean }) isFallbackPage: boolean = false

  pageActivated(): void {}

  static get styles(): CSSResult[] {
    return [
      commonStyle,
      css`
        :host {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
      `,
    ]
  }

  constructor(route: string, isFallbackPage: boolean = false) {
    super()
    this.route = route
    this.params = Router.getURLSearchParams()
    this.isFallbackPage = isFallbackPage
    this.style.display = 'none'

    document.addEventListener('after-navigate', (event: Event) => {
      const {
        title,
        route,
        params,
      }: { title: string; route: string; params: Record<string, any> } = (event as CustomEvent).detail
      if (this.route === route) {
        this.title = title
        this.params = params
        this.activated()
      }
    })
  }

  get info(): PageInfo {
    return {
      title: this.title,
      route: this.route,
    }
  }

  showPage(): void {
    this.style.display = 'flex'
  }

  hidePage(): void {
    this.style.display = 'none'
  }

  activated(): void {
    document.dispatchEvent(
      new CustomEvent('render-footer-content', {
        detail: { content: this.footerContent },
      })
    )

    this.pageActivated()
  }
}
