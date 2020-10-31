import { CSSResult, css } from 'lit-element'

export const commonStyle: CSSResult = css`
  mwc-icon {
    color: white;
  }
  mwc-icon:active {
    color: var(--theme-darker-color);
  }
`
