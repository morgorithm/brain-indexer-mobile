import { CSSResult, customElement, html, LitElement, property, TemplateResult } from 'lit-element'
import { commonStyle } from '../assets/styles/common-style'

export const enum ButtonTypes {
  Positive = 'positive',
  Negative = 'negative',
  Neutral = 'neutral',
}

export interface ButtonOption {
  disabled?: boolean
  instant?: boolean
  transaction?: boolean
}

export interface Button {
  name?: string
  icon?: string
  type: ButtonTypes
  action?: () => void
  option?: ButtonOption
}

@customElement('button-bar')
export class ButtonBar extends LitElement {
  @property({ type: Array }) buttons: Button[] = []

  static get styles(): CSSResult[] {
    return [commonStyle]
  }

  render(): TemplateResult {
    const buttons: Button[] = this.buttons

    return html`
      <div class="button-container">
        ${buttons.map(
          (button: Button) => html`
            <button class="${button.type || ButtonTypes.Neutral}" @click="${button.action}">
              ${button.icon ? html`<mwc-icon>${button.icon}</mwc-icon>` : ''}
              ${button.name ? html`<span class="button-name">${button.name}</span>` : ''}
            </button>
          `
        )}
      </div>
    `
  }
}
