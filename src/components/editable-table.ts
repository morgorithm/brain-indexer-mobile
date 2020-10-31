import { CSSResult, LitElement, TemplateResult, css, customElement, html, property } from 'lit-element'

export enum FieldTypes {
  text = 'text',
  number = 'number',
  select = 'select',
  checkbox = 'checkbox',
}

export interface Field {
  name: string
  type: FieldTypes
}

@customElement('editable-table')
export class EditableTable extends LitElement {
  @property({ type: Array }) fields: Field[] = []
  @property({ type: Array }) data: Record<string, any>[] = []
  @property({ type: Boolean }) selectable: boolean = true

  static get styles(): CSSResult[] {
    return [
      css`
        #header {
          display: grid;
        }
        #header > .field {
          margin: 10px 0;
        }
      `,
    ]
  }

  render(): TemplateResult {
    const fields: Field[] = this.fields || []
    const data: Record<string, any>[] = this.data || []

    return html`
      <div id="header" style="${`grid-template-columns: repeat(${fields.length + 1}, 1fr)`}">
        ${this.selectable ? html` <input type="checkbox" /> ` : ''}
        ${fields.map(
          (field: Field) => html`
            <div class="field">
              <span>${field.name}</span>
            </div>
          `
        )}
      </div>
    `
  }
}
