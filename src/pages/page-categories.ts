import '../components/crud-data-list'
import '../components/form-popup'

import { Category, CategoryEntity } from '../schemas/category'
import { TemplateResult, customElement, html, property } from 'lit-element'

import { Field } from '../components/crud-data-list'
import { Page } from './page'

@customElement('page-categories')
export class PageCategories extends Page {
  @property({ type: Array }) fields: Field[] = [{ name: 'name' }, { name: 'description' }]
  @property({ type: Array }) data: Record<string, any>[] = []

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
    } catch (e) {
      throw e
    }
  }

  async deleteCategory(e: CustomEvent): Promise<void> {
    try {
      const category: Category = new Category(e.detail.data)
      if (category.name) {
        await new CategoryEntity().delete(category.name)
        this.fetchCategories()
      }
    } catch (e) {
      throw e
    }
  }
}
