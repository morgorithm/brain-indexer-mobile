import '../components/editable-table'

import { Field, FieldTypes } from '../components/editable-table'
import { TemplateResult, customElement, html, property } from 'lit-element'

import { Page } from './page'

@customElement('page-home')
export class PageHome extends Page {
  @property({ type: Array }) fields: Field[] = [
    {
      name: 'Category',
      type: FieldTypes.text,
    },
    {
      name: 'qty',
      type: FieldTypes.number,
    },
  ]

  @property({ type: Array }) data: Record<string, any>[] = []

  render(): TemplateResult {
    return html` <editable-table .fields="${this.fields}" .data="${this.data}"></editable-table> `
  }

  constructor() {
    super('Brain Indexer', '')
  }
}
