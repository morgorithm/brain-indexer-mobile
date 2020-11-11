import { CSSResult, LitElement, TemplateResult, css, customElement, html, property } from 'lit-element'

import { ButtonOption } from './button-bar'
import { commonStyle } from '../assets/styles/common-style'

export interface ListField {
  name: string
  icon?: string
}

export interface ListFieldSet {
  keyField: ListField
  detailFields?: ListField[]
}

@customElement('simple-data-list')
export class SimpleDataList extends LitElement {
  @property({ type: Object }) fieldSet: ListFieldSet = { keyField: { name: '' } }
  @property({ type: String }) title: string = 'My List'
  @property({ type: Boolean }) selectable: boolean = false
  @property({ type: Boolean }) addable: boolean = false
  @property({ type: Boolean }) editable: boolean = false
  @property({ type: Array }) data: Record<string, any>[] = []

  @property({ type: Number }) selectedIdx?: number

  static get styles(): CSSResult[] {
    return [
      commonStyle,
      css`
        ul {
          list-style-type: none;
          padding-inline-start: var(--theme-wide-spacing, 10px);
          border-radius: var(--theme-common-radius, 5px);
          padding: var(--theme-common-spacing, 5px);
          background-color: var(--theme-darker-color);
          margin: 0;
        }
        .list-header {
          display: flex;
          margin: var(--theme-common-spacing, 5px);
          border-bottom: 1px solid var(--theme-dark-color);
          padding-bottom: var(--theme-common-spacing, 5px);
        }
        .title {
          flex: 1;
          margin: auto 0;
          color: white;
          font-weight: bolder;
        }
        .list-header > mwc-icon {
          font-size: medium;
          margin: auto 0px auto var(--theme-common-spacing, 5px);
        }
        li {
          color: white;
          padding: var(--theme-common-spacing, 5px);
          border-radius: var(--theme-common-radius, 5px);
        }
        li[selected] {
          background: var(--theme-neutral-color);
        }
        .card {
          display: flex;
        }
        span.key-field {
          flex: 1;
          font-weight: bold;
          text-overflow: ellipsis;
          overflow: hidden;
          margin: auto var(--theme-common-spacing, 5px);
        }
        .detail-card {
          height: 0px;
          min-height: 0;
          opacity: 0;
          transition: all 0.3s ease-out 0.1s;
        }
        .detail-card[opened] {
          min-height: 10vh;
          opacity: 100%;
          background-color: var(--theme-dark-color);
          border-radius: var(--theme-common-radius, 5px);
          margin-top: var(--theme-common-spacing, 5px);
          padding: var(--theme-common-spacing, 5px);
          transition: all 0.3s ease-out 0.1s;
        }
        .inner-button-container {
          display: flex;
          margin: var(--theme-common-spacing, 5px) 0px;
        }
        .inner-button {
          font-size: medium;
          margin: auto 0px auto var(--theme-common-spacing, 5px);
        }
        .inner-button:nth-child(1) {
          margin-left: auto;
        }
        .inner-button.positive {
          color: var(--theme-positive-color);
        }
        .inner-button.negative {
          color: var(--theme-negative-color);
        }
      `,
    ]
  }

  render(): TemplateResult {
    const fieldSet: ListFieldSet = this.fieldSet || { keyField: { name: '' } }
    const data: Record<string, any>[] = this.data || []

    const { name, icon }: ListField = fieldSet.keyField
    const detailFields: ListField[] = fieldSet.detailFields || []

    return html`
      <ul>
        <div class="list-header">
          <span class="title">${this.title}</span>
          ${this.addable ? html` <mwc-icon @click="${this.onAddButtonClick}">add_circle_outline</mwc-icon> ` : ''}
        </div>

        ${data.map((item: Record<string, any>, itemIdx: number) => {
          const selected: boolean = this.selectedIdx === itemIdx

          return html` <li
            @click="${(e: Event) => {
              if (this.selectable) {
                const listItem: HTMLLIElement = e.currentTarget as HTMLLIElement
                const isSelected: boolean = listItem.hasAttribute('selected')
                if (isSelected) {
                  listItem.removeAttribute('selected')
                } else {
                  listItem.setAttribute('selected', '')
                }
              }
            }}"
          >
            <div class="card">
              ${icon ? html`<span class="icon"><mwc-icon>${icon}</mwc-icon></span>` : ''}
              <span class="key-field">${item[name]}</span>

              ${detailFields?.length
                ? html`
                    <mwc-icon
                      @click="${(e: Event) => {
                        e.stopPropagation()
                        if (selected) {
                          this.selectedIdx = -1
                        } else {
                          this.selectedIdx = itemIdx
                        }
                      }}"
                      >${selected ? 'arrow_drop_up' : 'arrow_drop_down'}</mwc-icon
                    >
                  `
                : ''}
            </div>

            <div class="detail-card" ?opened="${selected}">
              ${detailFields.map(
                ({ name, icon }: ListField) => html`
                  ${icon ? html`<span class="icon"><mwc-icon>${icon}</mwc-icon></span>` : ''}
                  <span class="detail-field">${item[name]}</span>
                `
              )}
            </div>

            ${this.editable
              ? html`<div class="inner-button-container">
                  <mwc-icon
                    class="inner-button positive"
                    @click="${(e: Event) => {
                      e.stopPropagation()
                      this.onEditButtonClick(item)
                    }}"
                    >edit</mwc-icon
                  >
                  <mwc-icon
                    class="inner-button negative"
                    @click="${(e: Event) => {
                      e.stopPropagation()
                      this.onDeleteButtonClick(item)
                    }}"
                    >delete</mwc-icon
                  >
                </div>`
              : ''}
          </li>`
        })}
      </ul>
    `
  }

  onAddButtonClick() {
    this.dispatchEvent(new CustomEvent('addButtonClick'))
  }

  onEditButtonClick(data: Record<string, any>) {
    this.dispatchEvent(new CustomEvent('editButtonClick', { detail: { data } }))
  }

  onDeleteButtonClick(data: Record<string, any>) {
    this.dispatchEvent(new CustomEvent('deleteButtonClick', { detail: { data } }))
  }
}
