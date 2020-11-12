import '../components/crud-data-list'
import '../components/form-popup'

import { TemplateResult, customElement, html, property } from 'lit-element'

import { Category } from '../schemas'
import { CategoryEntity } from '../schemas/category'
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
    this.data = await Category.find()
  }

  async saveCategory(e: CustomEvent): Promise<void> {
    try {
      const category: Partial<CategoryEntity> = e.detail.data
      await Category.save(category)
      this.fetchCategories()
    } catch (e) {
      throw e
    }
  }

  async deleteCategory(e: CustomEvent): Promise<void> {
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
