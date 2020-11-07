import '../components/form-popup'

import { FieldTypes, FormField, FormPopup, PopupOption } from '../components/form-popup'
import { TemplateResult, customElement, html, property } from 'lit-element'

import { ButtonTypes } from '../components/button-bar'
import { Category } from '../schemas'
import { CategoryEntity } from '../schemas/category'
import { FormUtil } from '../utils'
import { Page } from './page'

@customElement('page-categories')
export class PageCategories extends Page {
  @property({ type: Array }) fields: string[] = ['name']
  @property({ type: Array }) formFields: FormField[] = [
    {
      name: 'name',
      option: {
        type: FieldTypes.Text,
      },
    },
  ]
  @property({ type: Object }) popupOption: PopupOption = {
    title: 'Add Category',
    buttons: [
      {
        icon: 'save',
        type: ButtonTypes.Positive,
        action: this.addCategory.bind(this),
      },
    ],
  }
  @property({ type: Array }) data: Record<string, any>[] = []

  render(): TemplateResult {
    const fields: string[] = this.fields || []
    const formFields: FormField[] = this.formFields || []
    const popupOption: PopupOption = this.popupOption || {}
    const data: Record<string, any>[] = this.data || []

    return html`<simple-data-table
        .fields="${fields}"
        .data="${data}"
        editable
        @addButtonClick="${this.onAddButtonClick}"
        @editButtonClick="${this.onEditButtonClick}"
        @deleteButtonClick="${this.onDeleteButtonClick}"
      ></simple-data-table>

      <form-popup .fields="${formFields}" .popupOption="${popupOption}"></form-popup>`
  }

  constructor() {
    super('Categories', 'categories')
  }

  async pageActivated(): Promise<void> {
    await this.fetchCategories()
  }

  get popup(): FormPopup | null {
    return this.renderRoot?.querySelector('form-popup')
  }

  async fetchCategories(): Promise<void> {
    this.data = await Category.find()
  }

  async addCategory(): Promise<void> {
    if (this.popup?.form) {
      const categoryForm: HTMLFormElement = this.popup.form
      try {
        await Category.add(FormUtil.serialize(categoryForm))
        this.popup.close()
        this.fetchCategories()
      } catch (e) {
        throw e
      }
    }
  }

  onAddButtonClick(): void {
    this.popup?.open()
  }

  onEditButtonClick(e: CustomEvent): void {
    const data: CategoryEntity = e.detail.data
    if (this.popup) {
      this.popup.data = data
      this.popup.open()
    }
  }

  async onDeleteButtonClick(e: CustomEvent): Promise<void> {
    try {
      const { name }: CategoryEntity = e.detail.data
      if (name) {
        await Category.delete(name)
        this.fetchCategories()
      }
    } catch (e) {
      throw e
    }
  }
}
