import './button-bar'

import { CSSResult, LitElement, PropertyValues, TemplateResult, css, customElement, html, property } from 'lit-element'

import { Button } from './button-bar'
import MarkdownIt from 'markdown-it'
import { commonStyle } from '../assets/styles/common-style'

const md: MarkdownIt = new MarkdownIt()

export enum FieldTypes {
  Text,
  Number,
  Selector,
  Checkbox,
  Date,
  Time,
  DateTime,
  Textarea,
  Markdown,
}

export interface BasicFieldOption {
  type?: FieldTypes
  required?: boolean
  editable?: boolean
  defaultValue?: any
  hidden?: boolean
  autoValidate?: boolean
}

export interface NumberFieldOption extends BasicFieldOption {
  step: string
  min: string
  max: string
}

export interface SelectorFieldOption extends BasicFieldOption {
  appendEmptyOption?: boolean
  options: Record<string, any>[]
  nameField: string
  valueField: string
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
          width: 95vw;
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
        .form [invalid] {
          border-color: var(--theme-negative-color, tomato);
        }
        .header {
          display: flex;
        }
        .header > mwc-icon {
          margin-left: auto;
          color: var(--theme-darker-color);
        }
        .header > mwc-icon:active {
          color: white;
        }
        .preview {
          background-color: white;
          min-height: 15vh;
          border-radius: var(--theme-common-radius, 5px);
          border: 1px solid var(--theme-darker-color);
          padding: 2px;
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
          <form class="form" @submit="${(e: Event) => e.preventDefault()}" @keypress="${this.onKeypressHandler}">
            <fieldset>
              ${fields.map((field: FormField) => {
                const { name, option }: FormField = field
                const {
                  type,
                  defaultValue = '',
                  required = false,
                  editable = true,
                  hidden = false,
                  autoValidate = true,
                } = option || {}

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
                          @input="${autoValidate ? this.commonValidityHandler.bind(this) : undefined}"
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
                          .value="${data[name] || defaultValue}"
                          ?required="${required}"
                          ?readonly="${!editable}"
                          @input="${autoValidate ? this.commonValidityHandler.bind(this) : undefined}"
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
                        .value="${data[name] || defaultValue}"
                        ?required="${required}"
                        ?readonly="${!editable}"
                        @input="${autoValidate ? this.commonValidityHandler.bind(this) : undefined}"
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
                        .value="${data[name] || defaultValue}"
                        ?required="${required}"
                        ?readonly="${!editable}"
                        .step="${step}"
                        .min="${min}"
                        .max="${max}"
                        @input="${autoValidate ? this.commonValidityHandler.bind(this) : undefined}"
                      />
                    </label>`
                    break

                  case FieldTypes.Selector:
                    const { nameField, valueField, options, appendEmptyOption = true } = option as SelectorFieldOption
                    template = html`
                      <label for="${name}" .hidden="${hidden}">
                        <span class="label">${name}</span>
                        <select
                          id="${name}"
                          name="${name}"
                          @input="${autoValidate ? this.commonValidityHandler.bind(this) : undefined}"
                        >
                          ${appendEmptyOption ? html`<option></option>` : ''}
                          ${options.map((option: Record<string, any>) => {
                            return html`<option
                              ?selected="${option[valueField] === data[valueField]}"
                              .value="${option[valueField]}"
                            >
                              ${option.name}
                            </option>`
                          })}
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
                        .value="${data[name] || defaultValue}"
                        ?required="${required}"
                        ?readonly="${!editable}"
                        @input="${autoValidate ? this.commonValidityHandler.bind(this) : undefined}"
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
                        .value="${data[name] || defaultValue}"
                        ?required="${required}"
                        ?readonly="${!editable}"
                        @input="${autoValidate ? this.commonValidityHandler.bind(this) : undefined}"
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
                          .value="${data[name] || defaultValue}"
                          ?required="${required}"
                          ?readonly="${!editable}"
                          @input="${autoValidate ? this.commonValidityHandler.bind(this) : undefined}"
                        ></textarea>
                      </label>
                    `
                    break

                  case FieldTypes.Markdown:
                    template = html`
                      <label for="${name}" .hidden="${hidden}">
                        <div class="header">
                          <span class="label">${name} </span>
                          <mwc-icon
                            @click="${() => {
                              const preview: HTMLDivElement | null = this.renderRoot?.querySelector(
                                `div#${name}.preview`
                              )
                              const editor: HTMLTextAreaElement | null = this.renderRoot?.querySelector(
                                `textarea#${name}`
                              )
                              if (preview && editor) {
                                if (preview.hasAttribute('hidden')) {
                                  preview.hidden = false
                                  editor.hidden = true
                                } else {
                                  preview.hidden = true
                                  editor.hidden = false
                                }
                              }
                            }}"
                            >preview</mwc-icon
                          >
                        </div>

                        <textarea
                          id="${name}"
                          name="${name}"
                          .value="${data[name] || defaultValue}"
                          ?required="${required}"
                          ?readonly="${!editable}"
                          @input="${autoValidate ? this.commonValidityHandler.bind(this) : undefined}"
                          @change="${(e: Event) => {
                            if (e.currentTarget) {
                              const textarea: HTMLTextAreaElement = e.currentTarget as HTMLTextAreaElement
                              const id: string = textarea.id
                              const preview: HTMLDivElement | null = this.renderRoot?.querySelector(`div#${id}.preview`)
                              if (preview) {
                                preview.innerHTML = md.render(textarea.value) || ''
                              }
                            }
                          }}"
                        ></textarea>

                        <div hidden id="${name}" class="preview"></div>
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
                        @input="${autoValidate ? this.commonValidityHandler.bind(this) : undefined}"
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

  private onKeypressHandler(e: KeyboardEvent) {
    const buttons: Button[] = this.popupOption?.buttons || []
    const button: Button | undefined = buttons.find(
      (button: Button) => button.actionKey?.toLowerCase() === e.key.toLowerCase()
    )
    if (button?.action) {
      button.action.apply(this)
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
    this.clearPreviews()
  }

  private clearPreviews(): void {
    const previewElements: HTMLDivElement[] = Array.from(this.renderRoot?.querySelectorAll('.preview'))
    previewElements.forEach((preview: HTMLDivElement) => {
      preview.innerHTML = ''
      preview.hidden = true
      const id: string = preview.id
      const textarea: HTMLTextAreaElement | null = this.renderRoot?.querySelector(`textarea#${id}`)
      if (textarea) {
        textarea.hidden = false
      }
    })
  }

  toggle(): void {
    this.isOpened = !this.isOpened
  }

  commonValidityHandler(e: Event): void {
    const input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement = e.currentTarget as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    if (input) {
      if (input.checkValidity()) {
        input.removeAttribute('invalid')
      } else {
        input.setAttribute('invalid', '')
      }
    }
  }
}
