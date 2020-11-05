import { CSSResult, css } from 'lit-element'

export const commonStyle: CSSResult = css`
  mwc-icon {
    color: white;
  }
  mwc-icon:active {
    color: var(--theme-darker-color);
  }
  .button-container {
    margin: var(--theme-common-spacing, 5px);
    display: flex;
  }
  .button-container > button:nth-child(1) {
    margin-left: auto;
  }
  button {
    min-width: 20vw;
    max-width: 20vw;
    display: flex;
    border: none;
    color: white;
    text-transform: capitalize;
    border-radius: var(--theme-common-radius, 5px);
    padding: var(--theme-common-spacing, 5px);
    box-shadow: 1px 1px rgba(0, 0, 0, 0.5);
    outline: none;
    margin: auto 0px;
    margin-left: var(--theme-common-spacing, 5px);
    padding: var(--theme-wide-spacing, 10px);
  }
  button:active {
    box-shadow: 0 0 rgba(0, 0, 0, 0.5);
  }
  button.positive {
    background-color: var(--theme-positive-color);
  }
  button.negative {
    background-color: var(--theme-negative-color);
  }
  button.neutral {
    background-color: var(--theme-neutral-color);
  }

  button > mwc-icon,
  button:active > mwc-icon {
    margin: auto;
    font-size: medium;
  }
`
