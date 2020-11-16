import './button-bar'

import { CSSResult, LitElement, PropertyValues, TemplateResult, css, customElement, html, property } from 'lit-element'

import { Button } from './button-bar'
import { Field } from './crud-data-list'
import { commonStyle } from '../assets/styles/common-style'

export enum FieldTypes {
  Text,
  Number,
  Selector,
  Checkbox,
  Date,
  Time,
  DateTime,
  Textarea,
}

export interface BasicFieldOption {
  type?: FieldTypes
  required?: boolean
  editable?: boolean
  defaultValue?: any
  hidden?: boolean
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
  @property({ type: Object }) data: Record<string, any> = {}
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
          height: auto;
          width: 0px;
          max-height: 80vh;
        }
        #popup-modal[opened] > #popup {
          width: 80vw;
        }
        #popup-modal span.popup-title {
          display: none;
          color: var(--theme-darker-color);
          border-radius: var(--theme-common-radius, 5px) var(--theme-common-radius, 5px) 0 0;
          background-color: var(--theme-primary-color);
        }
        #popup-modal[opened] span.popup-title {
          display: initial;
        }
        .form {
          margin: var(--theme-wide-spacing, 10px);
        }
        *[hidden] {
          display: none;
        }
      `,
    ]
  }

  render(): TemplateResult {
    const { title = '', resizable = false, movable = false, buttons = [] } = this.popupOption || {}
    const fields: FormField[] = this.fields || []
    const data: Record<string, any> = this.data || {}
    this.title = this.title || title

    return html`
      <div id="popup-modal" ?opened="${this.isOpened}" @click="${this.close.bind(this)}">
        <div id="popup" @click="${(e: Event) => e.stopPropagation()}">
          ${this.title ? html`<span class="popup-title">${this.title}</span>` : ''}
          <form class="form" @submit="${(e: Event) => e.preventDefault()}">
            <fieldset>
              ${fields.map((field: FormField) => {
                const { name, option }: FormField = field
                const { type, defaultValue = '', required = false, editable = true, hidden = false } = option || {}

                let template: TemplateResult

                switch (type) {
                  case FieldTypes.Checkbox:
                    template = html`
                      <label for="${name}" .hidden="${hidden}">
                        <span class="label">${name}</span>
                        <input
                          id="${name}"
                          name="${name}"
                          type="checkbox"
                          ?checked="${Boolean(data[name] || defaultValue)}"
                          ?required="${required}"
                          ?disabled="${!editable}"
                        />
                      </label>
                    `
                    break

                  case FieldTypes.Date:
                    template = html`
                      <label for="${name}" .hidden="${hidden}">
                        <span class="label">${name}</span>
                        <input
                          id="${name}"
                          name="${name}"
                          type="date"
                          value="${data[name] || defaultValue}"
                          ?required="${required}"
                          ?readonly="${!editable}"
                        />
                      </label>
                    `
                    break

                  case FieldTypes.DateTime:
                    template = html` <label for="${name}" .hidden="${hidden}">
                      <span class="label">${name}</span>
                      <input
                        id="${name}"
                        name="${name}"
                        type="datetime"
                        value="${data[name] || defaultValue}"
                        ?required="${required}"
                        ?readonly="${!editable}"
                      />
                    </label>`
                    break

                  case FieldTypes.Number:
                    const { step, min, max } = option as NumberFieldOption
                    template = html` <label for="${name}" .hidden="${hidden}">
                      <span class="label">${name}</span>
                      <input
                        id="${name}"
                        name="${name}"
                        type="number"
                        value="${data[name] || defaultValue}"
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
                      <label for="${name}" .hidden="${hidden}">
                        <span class="label">${name}</span>
                        <select id="${name}" name="${name}">
                          ${appendEmptyOption ? html`<option></option>` : ''}
                          ${options.map(
                            (option: SelectorOption) =>
                              html`<option .selected="${option.value === data[name]?.value}" value="${option.value}">
                                ${option.name}
                              </option>`
                          )}
                        </select>
                      </label>
                    `
                    break

                  case FieldTypes.Time:
                    template = html` <label for="${name}" .hidden="${hidden}">
                      <span class="label">${name}</span>
                      <input
                        id="${name}"
                        name="${name}"
                        type="time"
                        value="${data[name] || defaultValue}"
                        ?required="${required}"
                        ?readonly="${!editable}"
                      />
                    </label>`
                    break

                  case FieldTypes.Text:
                    template = html` <label for="${name}" .hidden="${hidden}">
                      <span class="label">${name}</span>
                      <input
                        id="${name}"
                        name="${name}"
                        type="text"
                        value="${data[name] || defaultValue}"
                        ?required="${required}"
                        ?readonly="${!editable}"
                      />
                    </label>`
                    break

                  case FieldTypes.Textarea:
                    template = html`
                      <label for="${name}" .hidden="${hidden}">
                        <span class="label">${name}</span>
                        <textarea
                          id="${name}"
                          name="${name}"
                          value="${data[name] || defaultValue}"
                          ?required="${required}"
                          ?readonly="${!editable}"
                        ></textarea>
                      </label>
                    `
                    break

                  default:
                    template = html` <label for="${name}" .hidden="${hidden}">
                      <span class="label">${name}</span>
                      <input
                        id="${name}"
                        name="${name}"
                        type="text"
                        value="${data[name] || defaultValue}"
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

  async updated(changedProps: PropertyValues): Promise<void> {
    if (changedProps.has('isOpened') && this.isOpened) {
      await this.updateComplete
      this.focus()
    }
  }

  focus(): void {
    if (this.fields?.length) {
      const firstFieldName: string | undefined = this.fields.find((field: FormField) => !field.option?.hidden)?.name
      if (firstFieldName) {
        const firstInput: HTMLInputElement | HTMLSelectElement | null | undefined = this.form?.querySelector(
          `[name=${firstFieldName}]`
        )

        if (firstInput) {
          firstInput.focus()
        }
      }
    }
  }

  open(): void {
    this.isOpened = true
  }

  close(): void {
    this.isOpened = false
    this.data = {}
    this.form?.reset()
  }

  toggle(): void {
    this.isOpened = !this.isOpened
  }
}
