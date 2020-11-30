import { CSSResult, LitElement, TemplateResult, css, customElement, html, property } from 'lit-element'

@customElement('progress-bar')
export class ProgressBar extends LitElement {
  @property({ type: Number }) rate: number = 0

  static get styles(): CSSResult[] {
    return [
      css`
        .wrapper {
          border: 1px solid var(--theme-darker-color, rgba(0, 0, 0, 0.5));
          height: 10px;
          margin: 2px;
          padding: 2px;
          border-radius: var(--theme-common-radius, 5px);
          background-color: transparent;
        }
        .bar {
          background-color: var(--theme-darker-color);
          height: inherit;
          border-radius: inherit;
          transition: width 0.3s ease-in-out;
        }
      `,
    ]
  }

  render(): TemplateResult {
    return html`
      <div class="wrapper">
        <div class="bar" style="width: ${this.rate}%;"></div>
      </div>
    `
  }
}
