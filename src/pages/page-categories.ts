import '../components/crud-data-list'
import '../components/form-popup'

import { CSSResult, TemplateResult, css, customElement, html, property } from 'lit-element'
import { Category, CategoryEntity } from '../schemas/category'
import { ToastMessageTypes, showToast } from '../components/toast-message'

import { Field } from '../components/crud-data-list'
import { Page } from './page'
import { commonStyle } from '../assets/styles/common-style'
import { pageCommonStyle } from '../assets/styles/page-common-style'

@customElement('page-categories')
export class PageCategories extends Page {
  @property({ type: Array }) fields: Field[] = [
    { name: 'id', hidden: true },
    { name: 'name', options: { required: true } },
    { name: 'itemCnt', hidden: true },
  ]
  @property({ type: Array }) data: Record<string, any>[] = []

  static get styles(): CSSResult[] {
    return [commonStyle, pageCommonStyle]
  }

  render(): TemplateResult {
    const fields: Field[] = this.fields || []
    const data: Record<string, any>[] = this.data || []

    return html` <crud-data-list
      .title="${this.title}"
      .fields="${fields}"
      .data="${data}"
      @saveButtonClick="${this.saveCategory}"
      @deleteButtonClick="${this.deleteCategory}"
    ></crud-data-list>`
  }

  constructor() {
    super('Categories', 'categories')
  }

  async pageActivated(): Promise<void> {
    await this.fetchCategories()
  }

  async fetchCategories(): Promise<void> {
    this.data = await new CategoryEntity().find()
  }

  async saveCategory(e: CustomEvent): Promise<void> {
    try {
      const category: Category = new Category(e.detail.data)
      await new CategoryEntity().save(category)

      this.fetchCategories()
      showToast({
        subtitle: 'category has been created',
        message: `'${category.name}' is created successfully`,
        type: ToastMessageTypes.Info,
      })
    } catch (e) {
      showToast({
        subtitle: 'failed to save category',
        message: e.message,
        type: ToastMessageTypes.Warn,
      })
    }
  }

  async deleteCategory(e: CustomEvent): Promise<void> {
    try {
      const { id, name }: Category = new Category(e.detail.data)
      if (id) {
        await new CategoryEntity().delete(id)
        this.fetchCategories()
        showToast({
          subtitle: 'category has been deleted',
          message: `'${name}' is deleted successfully`,
          type: ToastMessageTypes.Info,
        })
      }
    } catch (e) {
      showToast({
        subtitle: 'failed to delete category',
        message: e.message,
        type: ToastMessageTypes.Error,
      })
    }
  }
}
