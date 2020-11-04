import { CSSResult, css } from 'lit-element'

export const commonStyle: CSSResult = css`
  mwc-icon {
    color: white;
  }
  mwc-icon:active {
    color: var(--theme-darker-color);
  }
  button {
    display: flex;
    border: none;
    border-radius: var(--theme-common-radius, 5px);
    padding: var(--theme-common-padding, 5px);
    box-shadow: 1px 1px rgba(0, 0, 0, 0.5);
    outline: none;
  }
  button:active {
    box-shadow: 0 0 rgba(0, 0, 0, 0.5);
  }
  button.positive {
    background-color: var(--theme-positive-color);
  }
  button > mwc-icon,
  button:active > mwc-icon {
    margin: auto;
    font-size: medium;
    color: white;
  }
`
