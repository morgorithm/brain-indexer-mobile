import { CSSResult, LitElement, PropertyValues, css, property } from 'lit-element'
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
  @property({ type: Boolean, reflect: true }) show: boolean = false
  @property({ type: String }) title: string = ''
  @property({ type: String }) route: string
  @property({ type: Object }) params?: Record<string, any>
  @property({ type: Object }) footerContent?: FooterButtonContent | FooterMessageContent
  @property({ type: Boolean }) isHomePage: boolean = false
  @property({ type: Boolean }) isFallbackPage: boolean = false

  pageActivated(): void {}
  pageUpdated(changedProps: PropertyValues): void {}

  constructor(title: string, route: string, isFallbackPage: boolean = false) {
    super()
    this.title = title
    this.route = route
    this.params = Router.getURLSearchParams()
    this.isFallbackPage = isFallbackPage

    document.addEventListener('after-navigate', (event: Event) => {
      const {
        route,
        params,
      }: { title: string; route: string; params: Record<string, any> } = (event as CustomEvent).detail
      if (this.route === route) {
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

  updated(changedProps: PropertyValues) {
    if (this.route === location.pathname.replace(/^\//, '')) {
      this.pageUpdated(changedProps)
    }
  }

  showPage(): void {
    this.show = true
  }

  hidePage(): void {
    this.show = false
  }

  dispatchHeaderRendering(): void {
    document.dispatchEvent(
      new CustomEvent('render-header-content', {
        detail: { title: this.title },
      })
    )
  }

  dispatchFooterRendering(): void {
    document.dispatchEvent(
      new CustomEvent('render-footer-content', {
        detail: { content: this.footerContent },
      })
    )
  }

  activated(): void {
    this.dispatchHeaderRendering()
    this.dispatchFooterRendering()
    this.pageActivated()
  }
}
