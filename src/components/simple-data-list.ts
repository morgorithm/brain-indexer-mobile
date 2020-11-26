import { CSSResult, LitElement, TemplateResult, css, customElement, html, property } from 'lit-element'

import { ButtonOption } from './button-bar'
import { commonStyle } from '../assets/styles/common-style'

export interface ListField {
  name: string
  icon?: string
  displayModifier?: (data: any) => any
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
  @property({ type: Boolean }) private checkAll: boolean = false

  @property({ type: Number }) openedIdx?: number

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
          margin: auto 0px auto var(--theme-common-spacing, 5px);
        }
        li {
          color: white;
          padding: var(--theme-common-spacing, 5px);
          border: 1px solid var(--theme-dark-color);
          border-radius: var(--theme-common-radius, 5px);
          margin: var(--theme-common-spacing, 5px);
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
          display: flex;
          overflow: hidden;
          height: 0px;
          background-color: var(--theme-dark-color);
          border-radius: var(--theme-common-radius, 5px);

          transition: height 0.3s ease-out 0.1s;
        }
        .detail-card[opened] {
          height: 15vh;
          transition: height 0.3s ease-out 0.1s;
        }
        .detail-content {
          flex: 1;
          overflow: auto;
          padding: var(--theme-common-spacing, 5px);
        }
        .inner-button-container {
          display: flex;
          margin: var(--theme-common-spacing, 5px) 0px;
        }
        .inner-button {
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
    const addable: boolean = this.addable || false
    const selectable: boolean = this.selectable || false
    const data: Record<string, any>[] = this.data || []

    const { name, icon, displayModifier: keyFieldDisplayModifier }: ListField = fieldSet.keyField
    const detailFields: ListField[] = fieldSet.detailFields || []

    return html`
      <ul>
        <div class="list-header">
          <span class="title">${this.title}</span>
          ${addable ? html` <mwc-icon @click="${this.onAddButtonClick}">add_circle_outline</mwc-icon> ` : ''}
          ${selectable
            ? html`<mwc-icon @click="${this.selectAll}">${this.checkAll ? 'cancel' : 'check_circle'}</mwc-icon>`
            : ''}
        </div>

        ${data.map((item: Record<string, any>, itemIdx: number) => {
          const opened: boolean = this.openedIdx === itemIdx

          return html` <li
            ?selected="${this.checkAll}"
            @click="${(e: Event) => {
              if (selectable) {
                const listItem: HTMLLIElement = e.currentTarget as HTMLLIElement
                const isSelected: boolean = listItem.hasAttribute('selected')
                if (isSelected) {
                  listItem.removeAttribute('selected')
                  this.dispatchEvent(new CustomEvent('selectedItemChanged'))
                } else {
                  listItem.setAttribute('selected', '')
                  this.dispatchEvent(new CustomEvent('selectedItemChanged'))
                }
              }
            }}"
          >
            <div class="card">
              ${icon ? html`<span class="icon"><mwc-icon>${icon}</mwc-icon></span>` : ''}
              <span class="key-field">${(keyFieldDisplayModifier && keyFieldDisplayModifier(item)) || item[name]}</span>

              ${detailFields?.length
                ? html`
                    <mwc-icon
                      @click="${(e: Event) => {
                        e.stopPropagation()
                        if (opened) {
                          this.openedIdx = -1
                        } else {
                          this.openedIdx = itemIdx
                        }
                      }}"
                      >${opened ? 'arrow_drop_up' : 'arrow_drop_down'}</mwc-icon
                    >
                  `
                : ''}
            </div>

            <div class="detail-card" ?opened="${opened}">
              <div class="detail-content">
                ${detailFields.map(
                  ({ name, icon, displayModifier }: ListField) => html`
                    ${icon ? html`<span class="icon"><mwc-icon>${icon}</mwc-icon></span>` : ''}
                    <span class="detail-field">${(displayModifier && displayModifier(item)) || item[name]}</span>
                  `
                )}
              </div>
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

  private async selectAll() {
    this.checkAll = !this.checkAll
    await this.updateComplete
    this.dispatchEvent(new CustomEvent('selectedItemChanged'))
  }

  get selectedItems(): HTMLLIElement[] {
    return Array.from(this.renderRoot.querySelectorAll('li[selected]'))
  }

  get selectedData(): Record<string, any>[] {
    const selectedIndexes: number[] = this.selectedItems
      .filter((li: HTMLLIElement) => li.hasAttribute('selected'))
      .map((li: HTMLLIElement, idx) => idx)
    return this.data.filter((_: Record<string, any>, idx: number) => selectedIndexes.indexOf(idx) >= 0)
  }

  onAddButtonClick() {
    this.dispatchEvent(new CustomEvent('addButtonClick', { composed: true }))
  }

  onEditButtonClick(data: Record<string, any>) {
    this.dispatchEvent(new CustomEvent('editButtonClick', { detail: { data }, composed: true }))
  }

  onDeleteButtonClick(data: Record<string, any>) {
    this.dispatchEvent(new CustomEvent('deleteButtonClick', { detail: { data }, composed: true }))
  }
}
