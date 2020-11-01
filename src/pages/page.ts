import { LitElement, property } from 'lit-element'

export interface PageInfo {
  title: string
  route: string
  isFallbackPage?: boolean
}

export class Page extends LitElement implements PageInfo {
  @property({ type: String }) title: string
  @property({ type: String }) route: string
  @property({ type: Boolean }) isFallbackPage: boolean = false

  constructor(title: string, route: string, isFallbackPage: boolean = false) {
    super()
    this.title = title
    this.route = route
    this.isFallbackPage = isFallbackPage
    this.style.display = 'none'
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
}
