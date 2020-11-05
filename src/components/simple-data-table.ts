import '@material/mwc-icon'

import { CSSResult, LitElement, TemplateResult, css, customElement, html, property } from 'lit-element'

import { commonStyle } from '../assets/styles/common-style'

@customElement('simple-data-table')
export class SimpleDataTable extends LitElement {
  @property({ type: Array }) fields: string[] = []
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
        thead {
          text-transform: capitalize;
        }
        tbody {
          text-align: center;
        }
        th {
          border-bottom: 1px solid var(--theme-dark-color);
        }
        th > mwc-icon {
          font-size: medium;
        }
        th,
        td {
          padding: var(--theme-common-spacing, 5px) 0;
        }
        .index {
          width: 10px;
        }
        .editable-icon > mwc-icon {
          font-size: medium;
        }
      `,
    ]
  }

  render(): TemplateResult {
    const fields: string[] = this.fields || []
    const data: Record<string, any>[] = this.data || []

    return html`
      <table>
        <thead>
          <tr>
            ${this.selectable
              ? html`<th>
                  <mwc-icon @click="${this.switchCheckAll.bind(this)}"
                    >${this.checkAll ? 'cancel' : 'check_circle'}</mwc-icon
                  >
                </th>`
              : ''}
            <th class="index">No.</th>
            ${fields.map((field: string) => html`<th>${field}</th>`)} ${this.editable ? html`<th></th>` : ''}
          </tr>
        </thead>
        <tbody>
          ${data.map(
            (item: Record<string, any>, rowIdx: number) =>
              html` <tr>
                ${this.selectable ? html`<td><input .checked="${this.checkAll}" type="checkbox" /></td>` : ''}
                <td class="index">${rowIdx + 1}</td>
                ${fields.map((field: string) => html`<td>${item[field]}</td>`)}
                ${this.editable
                  ? html`<td class="editable-icon">
                      <mwc-icon @click="${() => this.onMoreBtnClick(item)}">more_horiz</mwc-icon>
                    </td>`
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

  onMoreBtnClick(data: Record<string, any>): void {
    console.log(data)
  }
}
