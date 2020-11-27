import { CSSResult, LitElement, TemplateResult, css, customElement, html, property } from 'lit-element'

import { commonStyle } from '../assets/styles/common-style'

export const enum ToastMessageTypes {
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

export interface ToastMessageOption {
  type: ToastMessageTypes
  subtitle?: string
  message: string
  interval?: number
}

export function showToast(messageOption: ToastMessageOption): void {
  document.dispatchEvent(
    new CustomEvent('toast-up', {
      detail: messageOption,
    })
  )
}

@customElement('toast-message')
export class ToastMessage extends LitElement {
  @property({ type: Boolean, reflect: true }) showToast: boolean = false
  @property({ type: Object }) message?: ToastMessageOption

  private messageStack: ToastMessageOption[] = []
  private iconMap: Record<ToastMessageTypes, string> = {
    [ToastMessageTypes.Info]: 'info',
    [ToastMessageTypes.Warn]: 'warning',
    [ToastMessageTypes.Error]: 'error',
  }

  static get styles(): CSSResult[] {
    return [
      commonStyle,
      css`
        :host {
          position: absolute;
          z-index: 10;
          max-height: 20vh;
          bottom: -20vh;
          left: 0;
          right: 0;
          transition: bottom 0.5s;
        }
        :host([showToast]) {
          bottom: 0px;
          transition: bottom 0.5s;
        }
        .message-container {
          display: flex;
          border: 2px solid var(--theme-darker-color);
          background-color: var(--theme-primary-color);
          padding: 10px;
          margin: 10px;
          border-radius: 5px;
        }
        mwc-icon {
          margin: auto;
          padding: var(--theme-common-spacing, 5px) 0px;
        }
        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin: var(--theme-common-spacing, 5px);
          color: white;
        }
        .info {
          background-color: var(--theme-positive-color);
        }
        .warn {
          background-color: var(--theme-warn-color);
        }
        .error {
          background-color: var(--theme-negative-color);
        }
        .title {
          text-transform: capitalize;
          font-weight: bold;
        }
      `,
    ]
  }

  render(): TemplateResult {
    const { type = ToastMessageTypes.Info, subtitle = '', message }: ToastMessageOption = this.message || {
      type: ToastMessageTypes.Info,
      message: '',
    }

    return html`
      <div class="message-container ${type}">
        <mwc-icon>${this.iconMap[type]}</mwc-icon>
        <div class="content">
          ${subtitle ? html`<span class="title">${subtitle}</span> ` : ''}
          <span class="message">${message}</span>
        </div>
      </div>
    `
  }

  firstUpdated() {
    document.addEventListener('toast-up', (e: Event) => this.onToastUp(e as CustomEvent))
  }

  onToastUp(e: CustomEvent): void {
    const toastMessageOption: ToastMessageOption = e.detail
    this.messageStack.push(toastMessageOption)
    this.toastUp()
  }

  toastUp(): void {
    if (this.messageStack.length) {
      if (!this.showToast) {
        this.message = this.messageStack.shift()
        this.showToast = true

        setTimeout(async () => {
          await this.toastDown()
          if (this.messageStack.length) {
            this.toastUp()
          }
        }, (this.message?.interval && this.message.interval * 1000 + 500) || 1000 + 500)
      }
    }
  }

  async toastDown(): Promise<void> {
    this.showToast = false
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 500)
    })
  }
}
