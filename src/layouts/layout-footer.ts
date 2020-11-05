import { LitElement, TemplateResult, customElement, html, property, css, CSSResult } from 'lit-element'
import { commonStyle } from '../assets/styles/common-style'

export const enum FooterTypes {
  Button = 'button',
  Message = 'message',
}

export const enum ButtonTypes {
  Positive = 'positive',
  Negative = 'negative',
  Neutral = 'neutral',
}

export const enum MessageTypes {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

export interface FooterButtonOption {
  disabled?: boolean
  instant?: boolean
  transaction?: boolean
}

export interface FooterButton {
  name?: string
  icon?: string
  type: ButtonTypes
  action: () => void
  option?: FooterButtonOption
}

export interface FooterMessage {
  message: string
  icon?: string
  type: MessageTypes
  action?: () => void
}

export interface FooterButtonContent {
  type: FooterTypes.Button
  buttons: FooterButton[]
}

export interface FooterMessageContent {
  type: FooterTypes.Message
  message: FooterMessage
}

@customElement('layout-footer')
export class LayoutFooter extends LitElement {
  @property({ type: Object }) content?: FooterButtonContent | FooterMessageContent

  static get styles(): CSSResult[] {
    return [commonStyle, css``]
  }

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
    const buttons: FooterButton[] = (this.content as FooterButtonContent).buttons || []

    return html`
      <div class="button-container">
        ${buttons.map(
          (button: FooterButton) => html`
            <button class="${button.type || ButtonTypes.Neutral}" @click="${button.action}">
              ${button.icon ? html`<mwc-icon>${button.icon}</mwc-icon>` : ''}
              ${button.name ? html`<span class="button-name">${button.name}</span>` : ''}
            </button>
          `
        )}
      </div>
    `
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
