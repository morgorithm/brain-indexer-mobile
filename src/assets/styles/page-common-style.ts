import { CSSResult, css } from 'lit-element'

export const pageCommonStyle: CSSResult = css`
  :host {
    display: none;
    overflow: hidden;
  }
  :host([show]) {
    display: flex;
    flex-direction: column;
    flex: 1;
  }}
`
