import { LitElement, property } from 'lit-element'
import { FooterButtonContent, FooterMessageContent } from '../layouts/layout-footer'

export interface PageInfo {
  title: string
  route: string
  footerContent?: FooterButtonContent | FooterMessageContent
  isFallbackPage?: boolean
}

export class Page extends LitElement implements PageInfo {
  @property({ type: String }) title: string
  @property({ type: String }) route: string
  @property({ type: Object }) footerContent?: FooterButtonContent | FooterMessageContent
  @property({ type: Boolean }) isFallbackPage: boolean = false

  constructor(title: string, route: string, isFallbackPage: boolean = false) {
    super()
    this.title = title
    this.route = route
    this.isFallbackPage = isFallbackPage
    this.style.display = 'none'

    document.addEventListener('after-navigate', (event: Event) => {
      const { title, route }: { title: string; route: string } = (event as CustomEvent).detail
      if (this.route === route) {
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
  }
}
