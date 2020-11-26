import { LitElement, TemplateResult, customElement, html, property } from 'lit-element'

export const enum ToastMessageTypes {
  Info,
  Warn,
  Error,
}

export interface ToastMessageOption {
  type: ToastMessageTypes
  subtitle?: string
  message: string
  interval?: number
}

@customElement('toast-message')
export class ToastMessage extends LitElement {
  @property({ type: Boolean, reflect: true }) showToast: boolean = false
  @property({ type: Object })
  message?: ToastMessageOption
  private messageStack: ToastMessageOption[] = []

  render(): TemplateResult {
    const {} 
    return html` <div class="message-container">
      ${}

    </div> `
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
      this.message = this.messageStack.shift()
      this.showToast = true

      setTimeout(async () => {
        if (this.messageStack.length) {
          await this.toastDown()
          this.toastUp()
        }
      }, (this.message?.interval && this.message.interval * 1000 + 1000) || 3000 + 1000)
    }
  }

  async toastDown(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.showToast = false
        resolve()
      }, 1000)
    })
  }
}
