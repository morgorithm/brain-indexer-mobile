import '../components/form-popup'

import { ButtonTypes, FooterButton, FooterButtonContent, FooterTypes } from '../layouts/layout-footer'
import { FieldTypes, FormField, FormPopup, PopupOption } from '../components/form-popup'
import { TemplateResult, customElement, html, property } from 'lit-element'

import { Page } from './page'

@customElement('page-categories')
export class PageCategories extends Page {
  @property({ type: Array }) fields: string[] = ['category', 'qty']
  @property({ type: Array }) formFields: FormField[] = [
    {
      name: 'category',
      option: {
        type: FieldTypes.Text,
      },
    },
  ]
  @property({ type: Object }) popupOption: PopupOption = {
    title: 'Add Category',
  }
  @property({ type: Array }) data: Record<string, any>[] = [
    {
      category: 'Computer Science',
      qty: 10,
    },
  ]

  @property({ type: Object }) footerContent: FooterButtonContent = {
    type: FooterTypes.Button,
    buttons: [
      {
        icon: 'add',
        type: ButtonTypes.Positive,
        action: this.popup?.toggle,
      },
    ],
  }

  render(): TemplateResult {
    const fields: string[] = this.fields || []
    const formFields: FormField[] = this.formFields || []
    const popupOption: PopupOption = this.popupOption || {}
    const data: Record<string, any>[] = this.data || []

    return html`<simple-data-table .fields="${fields}" .data="${data}" appendable></simple-data-table>
      <form-popup .fields="${formFields}" .popupOption="${popupOption}"></form-popup>`
  }

  constructor() {
    super('Categories', 'categories')
  }

  get popup(): FormPopup | null {
    return this.renderRoot?.querySelector('form-popup')
  }
}
