import { css, CSSResult, customElement, html, LitElement, property, TemplateResult } from 'lit-element'
import { commonStyle } from '../assets/styles/common-style'
import { Button } from './button-bar'
import './button-bar'

export enum FieldTypes {
  Text = 'text',
  Number = 'number',
  Selector = 'selector',
  Checkbox = 'checkbox',
  Date = 'date',
  Time = 'time',
  DateTime = 'datetime',
}

export interface BasicFieldOption {
  type?: FieldTypes
  required?: boolean
  editable?: boolean
  defaultValue?: any
}

export interface NumberFieldOption extends BasicFieldOption {
  step: string
  min: string
  max: string
}

export interface SelectorOption {
  name: string
  value: any
}

export interface SelectorFieldOption extends BasicFieldOption {
  appendEmptyOption?: boolean
  options: SelectorOption[]
}

export type FieldOption = BasicFieldOption | NumberFieldOption | SelectorFieldOption

export interface FormField {
  name: string
  option?: FieldOption
}

export interface PopupOption {
  title?: string
  resizable?: boolean
  movable?: boolean
  buttons?: Button[]
}

@customElement('form-popup')
export class FormPopup extends LitElement {
  @property({ type: Array }) fields: FormField[] = []
  @property({ type: Object }) popupOption?: PopupOption
  @property({ type: Boolean }) isOpened: boolean = false

  static get styles(): CSSResult[] {
    return [
      commonStyle,
      css`
        #popup-modal {
          display: flex;
          opacity: 0;
          position: absolute;
          left: -100vw;
          top: -100vh;
          background-color: rgba(0, 0, 0, 0.6);
        }
        #popup-modal[opened] {
          display: flex;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          opacity: 100%;
          width: 100vw;
          height: 100vh;
          transition: opacity 0.3s ease-out 0.1s;
        }
        #popup-modal > #popup {
          background-color: var(--theme-dark-color);
          margin: auto;
          border-radius: var(--theme-common-radius, 5px);
          display: flex;
          flex-direction: column;
          height: 0px;
          width: 0px;
        }
        #popup-modal[opened] > #popup {
          height: 30vh;
          width: 80vw;
          transition: height 0.3s ease-out 0.1s;
        }
        #popup-modal span.popup-title {
          display: none;
        }
        #popup-modal[opened] span.popup-title {
          display: initial;
        }
        .form {
          margin: var(--theme-wide-spacing, 10px);
        }
      `,
    ]
  }

  render(): TemplateResult {
    const { title = '', resizable = false, movable = false, buttons = [] } = this.popupOption || {}
    const fields: FormField[] = this.fields || []

    return html`
      <div id="popup-modal" ?opened="${this.isOpened}" @click="${this.close.bind(this)}">
        <div id="popup" @click="${(e: Event) => e.stopPropagation()}">
          ${title ? html`<span class="popup-title">${title}</span>` : ''}
          <form class="form">
            <fieldset>
              ${fields.map((field: FormField) => {
                const { name, option }: FormField = field
                const { type, defaultValue = '', required = false, editable = true } = option || {}

                let template: TemplateResult

                switch (type) {
                  case FieldTypes.Checkbox:
                    template = html`
                      <label for="${name}">
                        <span class="label">${name}</span>
                        <input
                          id="${name}"
                          name="${name}"
                          type="checkbox"
                          ?checked="${Boolean(defaultValue)}"
                          ?required="${required}"
                          ?disabled="${!editable}"
                        />
                      </label>
                    `
                    break

                  case FieldTypes.Date:
                    template = html`
                      <label for="${name}">
                        <span class="label">${name}</span>
                        <input
                          id="${name}"
                          name="${name}"
                          type="date"
                          value="${defaultValue}"
                          ?required="${required}"
                          ?readonly="${!editable}"
                        />
                      </label>
                    `
                    break

                  case FieldTypes.DateTime:
                    template = html` <label for="${name}">
                      <span class="label">${name}</span>
                      <input
                        id="${name}"
                        name="${name}"
                        type="datetime"
                        value="${defaultValue}"
                        ?required="${required}"
                        ?readonly="${!editable}"
                      />
                    </label>`
                    break

                  case FieldTypes.Number:
                    const { step, min, max } = option as NumberFieldOption
                    template = html` <label for="${name}">
                      <span class="label">${name}</span>
                      <input
                        id="${name}"
                        name="${name}"
                        type="number"
                        value="${defaultValue}"
                        ?required="${required}"
                        ?readonly="${!editable}"
                        .step="${step}"
                        .min="${min}"
                        .max="${max}"
                      />
                    </label>`
                    break

                  case FieldTypes.Selector:
                    const { options, appendEmptyOption = true } = option as SelectorFieldOption
                    template = html`
                      <label for="${name}">
                        <span class="label">${name}</span>
                        <select id="${name}" name="${name}">
                          ${appendEmptyOption ? html`<option></option>` : ''}
                          ${options.map(
                            (option: SelectorOption) => html`<option value="${option.value}">${option.value}</option>`
                          )}
                        </select>
                      </label>
                    `
                    break

                  case FieldTypes.Time:
                    template = html` <label for="${name}">
                      <span class="label">${name}</span>
                      <input
                        id="${name}"
                        name="${name}"
                        type="time"
                        value="${defaultValue}"
                        ?required="${required}"
                        ?readonly="${!editable}"
                      />
                    </label>`
                    break

                  case FieldTypes.Text:
                    template = html` <label for="${name}">
                      <span class="label">${name}</span>
                      <input
                        id="${name}"
                        name="${name}"
                        type="text"
                        value="${defaultValue}"
                        ?required="${required}"
                        ?readonly="${!editable}"
                      />
                    </label>`
                    break

                  default:
                    template = html` <label for="${name}">
                      <span class="label">${name}</span>
                      <input
                        id="${name}"
                        name="${name}"
                        type="text"
                        value="${defaultValue}"
                        ?required="${required}"
                        ?readonly="${!editable}"
                      />
                    </label>`
                }

                return template
              })}
            </fieldset>
          </form>

          <button-bar .buttons="${buttons}"></button-bar>
        </div>
      </div>
    `
  }

  get form(): HTMLFormElement | null {
    return this.renderRoot?.querySelector('form')
  }

  open(): void {
    this.isOpened = true
  }

  close(): void {
    this.isOpened = false
  }

  toggle(): void {
    console.log('test')
    this.isOpened = !this.isOpened
  }
}
