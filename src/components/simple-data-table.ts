import '@material/mwc-icon'

import { CSSResult, LitElement, TemplateResult, css, customElement, html, property } from 'lit-element'

import { commonStyle } from '../assets/styles/common-style'

export interface TableCaption {
  icon?: string
  caption: string
}

@customElement('simple-data-table')
export class SimpleDataTable extends LitElement {
  @property({ type: Object }) caption?: TableCaption
  @property({ type: Array }) fields: string[] = []
  @property({ type: Boolean }) numbering: boolean = true
  @property({ type: Array }) data: Record<string, any>[] = []
  @property({ type: Boolean }) selectable: boolean = false
  @property({ type: Boolean }) editable: boolean = false
  @property({ type: Boolean }) checkAll: boolean = false

  static get styles(): CSSResult[] {
    return [
      commonStyle,
      css`
        :host {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: auto;
        }
        table {
          border-radius: var(--theme-common-radius, 5px);
          padding: var(--theme-common-spacing, 5px);
          background-color: var(--theme-darker-color);
          border-spacing: unset;
          color: white;
        }
        caption {
          font-weight: bold;
        }
        thead {
          text-transform: capitalize;
        }
        tbody {
          text-align: center;
        }
        th {
          border-bottom: 1px solid var(--theme-dark-color);
        }
        th,
        td {
          padding: var(--theme-common-spacing, 5px) 0;
        }
        .index {
          width: 10px;
        }
      `,
    ]
  }

  render(): TemplateResult {
    const { icon, caption } = this.caption || {}
    const fields: string[] = this.fields || []
    const data: Record<string, any>[] = this.data || []

    return html`
      <table>
        ${caption
          ? html`
              <caption>
                ${icon ? html`<mwc-icon>${icon}</mwc-icon>` : ''}
                <span>${caption} </span>
              </caption>
            `
          : ''}
        <thead>
          <tr>
            ${this.selectable
              ? html`<th>
                  <mwc-icon @click="${this.switchCheckAll.bind(this)}"
                    >${this.checkAll ? 'cancel' : 'check_circle'}</mwc-icon
                  >
                </th>`
              : ''}
            ${this.numbering ? html`<th class="index">No.</th>` : ''}
            ${fields.map((field: string) => html`<th>${field}</th>`)}
            ${this.editable
              ? html`<th></th>
                  <th><mwc-icon @click="${this.onAddBtnClick}">add_circle_outline</mwc-icon></th>`
              : ''}
          </tr>
        </thead>
        <tbody>
          ${data.map(
            (item: Record<string, any>, rowIdx: number) =>
              html` <tr>
                ${this.selectable ? html`<td><input .checked="${this.checkAll}" type="checkbox" /></td>` : ''}
                ${this.numbering ? html`<td class="index">${rowIdx + 1}</td>` : ''}
                ${fields.map((field: string) => html`<td>${item[field]}</td>`)}
                ${this.editable
                  ? html`<td class="editable-icon">
                        <mwc-icon @click="${() => this.onEditBtnClick(item)}">edit</mwc-icon>
                      </td>
                      <td class="delete-icon">
                        <mwc-icon @click="${() => this.onDeleteBtnClick(item)}">delete_outline</mwc-icon>
                      </td> `
                  : ''}
              </tr>`
          )}
        </tbody>
      </table>
    `
  }

  switchCheckAll() {
    this.checkAll = !this.checkAll
  }

  onAddBtnClick(): void {
    this.dispatchEvent(new CustomEvent('addButtonClick'))
  }

  onEditBtnClick(data: Record<string, any>): void {
    this.dispatchEvent(
      new CustomEvent('editButtonClick', {
        detail: { data },
      })
    )
  }

  onDeleteBtnClick(data: Record<string, any>): void {
    this.dispatchEvent(
      new CustomEvent('deleteButtonClick', {
        detail: { data },
      })
    )
  }
}
