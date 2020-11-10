import '../components/form-popup'
import '../components/simple-data-list'

import { FieldTypes, FormField, FormPopup, PopupOption } from '../components/form-popup'
import { ListField, ListFieldSet } from '../components/simple-data-list'
import { TemplateResult, customElement, html, property } from 'lit-element'

import { ButtonTypes } from '../components/button-bar'
import { Category } from '../schemas'
import { CategoryEntity } from '../schemas/category'
import { FormUtil } from '../utils'
import { Page } from './page'

@customElement('page-categories')
export class PageCategories extends Page {
  @property({ type: Array }) fields: ListFieldSet[] = [
    { keyField: { name: 'name' }, detailFields: [{ name: 'description' }] },
  ]
  @property({ type: Array }) formFields: FormField[] = [{ name: 'name' }, { name: 'description' }]
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
    const fields: ListFieldSet[] = this.fields || []
    const formFields: FormField[] = this.formFields || []
    const popupOption: PopupOption = this.popupOption || {}
    const data: Record<string, any>[] = this.data || []

    return html` <simple-data-list
        .fields="${fields}"
        .data="${data}"
        addable
        editable
        @addButtonClick="${this.onAddButtonClick}"
        @editButtonClick="${this.onEditButtonClick}"
        @deleteButtonClick="${this.onDeleteButtonClick}"
      ></simple-data-list>

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
