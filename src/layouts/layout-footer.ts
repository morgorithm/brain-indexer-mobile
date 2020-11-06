import { customElement, html, LitElement, property, TemplateResult } from 'lit-element'
import '../components/button-bar'
import { Button } from '../components/button-bar'

export const enum FooterTypes {
  Button = 'button',
  Message = 'message',
}

export const enum MessageTypes {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

export interface FooterMessage {
  message: string
  icon?: string
  type: MessageTypes
  action?: () => void
}

export interface FooterButtonContent {
  type: FooterTypes.Button
  buttons: Button[]
}

export interface FooterMessageContent {
  type: FooterTypes.Message
  message: FooterMessage
}

@customElement('layout-footer')
export class LayoutFooter extends LitElement {
  @property({ type: Object }) content?: FooterButtonContent | FooterMessageContent

  render(): TemplateResult {
    return html`<footer>${this.renderFooterContent()}</footer>`
  }

  constructor() {
    super()
    document.addEventListener('render-footer-content', (e: Event) => {
      this.content = (e as CustomEvent).detail.content
    })
  }

  private renderFooterContent(): TemplateResult {
    if (this.content?.type === FooterTypes.Button) {
      return this.renderFooterButtonContent()
    } else if (this.content?.type === FooterTypes.Message) {
      return this.renderFooterMessageContent()
    } else {
      return html``
    }
  }

  private renderFooterButtonContent(): TemplateResult {
    const buttons: Button[] = (this.content as FooterButtonContent).buttons || []

    return html` <button-bar .buttons="${buttons}"></button-bar> `
  }

  private renderFooterMessageContent(): TemplateResult {
    const message: FooterMessage = (this.content as FooterMessageContent).message || ''

    return html`
      <div class="message-container">
        <span class="${message.type || MessageTypes.Info}" @click="${message.action}">
          ${message.icon ? html`<mwc-icon>${message.icon}</mwc-icon>` : ''} ${message.message}</span
        >
      </div>
    `
  }
}
