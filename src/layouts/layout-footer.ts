import { LitElement, TemplateResult, customElement, html } from 'lit-element'

@customElement('layout-footer')
export class LayoutFooter extends LitElement {
  render(): TemplateResult {
    return html`<h4>Layout footer</h4>`
  }
}
