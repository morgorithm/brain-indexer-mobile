import './form-popup'
import './simple-data-list'

import { FieldOption, FieldTypes, FormField, FormPopup, PopupOption } from './form-popup'
import { LitElement, TemplateResult, customElement, html, property } from 'lit-element'

import { ButtonTypes } from './button-bar'
import { FormUtil } from '../utils'
import { ListFieldSet } from './simple-data-list'

export interface Field {
  name: string
  icon?: string
  type?: FieldTypes
  options?: FieldOption
}

@customElement('crud-data-list')
export class CRUDDataList extends LitElement {
  @property({ type: Array }) fields: Field[] = []
  @property({ type: Object }) popupOption: PopupOption = {
    buttons: [
      {
        icon: 'save',
        type: ButtonTypes.Positive,
        action: () => {
          if (this.popup?.form) {
            this.dispatchEvent(
              new CustomEvent('addButtonClick', {
                detail: { data: FormUtil.serialize(this.popup.form) },
              })
            )
            this.popup.close()
          }
        },
      },
    ],
  }
  @property({ type: Array }) data: Record<string, any>[] = []

  render(): TemplateResult {
    const fields: Field[] = this.fields || []
    const formFields: FormField[] = this.convertFieldsToFormFields(fields)
    const fieldSet: ListFieldSet = this.convertFieldsToListFieldSet(fields)
    const data: Record<string, any>[] = this.data || []

    return html`
      <simple-data-list
        .fieldSet="${fieldSet}"
        .data="${data}"
        addable
        editable
        @addButtonClick="${this.onAddButtonClick}"
        @editButtonClick="${this.onEditButtonClick}"
      ></simple-data-list>

      <form-popup .fields="${formFields}" .popupOption="${this.popupOption}"></form-popup>
    `
  }

  get popup(): FormPopup | null {
    return this.renderRoot?.querySelector('form-popup')
  }

  private convertFieldsToFormFields(fields: Field[]): FormField[] {
    return fields.map(
      (field: Field): FormField => {
        return {
          name: field.name,
          option: field.options || {},
        }
      }
    )
  }

  private convertFieldsToListFieldSet(fields: Field[]): ListFieldSet {
    if (fields.length) {
      return {
        keyField: { name: fields[0].name, icon: fields[0].icon || '' },
        detailFields: fields.slice(1).map((field: Field) => {
          return {
            name: field.name,
            icon: field.icon || '',
          }
        }),
      }
    } else {
      return { keyField: { name: '' } }
    }
  }

  private onAddButtonClick(): void {
    this.popup?.open()
  }

  private onEditButtonClick(e: CustomEvent): void {
    const data: Record<string, any> = e.detail.data
    if (this.popup) {
      debugger
      this.popup.data = data
      this.popup.open()
    }
  }
}
