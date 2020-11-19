import '@material/mwc-icon'

import { CSSResult, LitElement, TemplateResult, css, customElement, html, property } from 'lit-element'

export interface Menu {
  icon: string
  title: string
  route: string
}

@customElement('side-menus')
export class SideMenus extends LitElement {
  @property({ type: Array }) menus: Menu[] = []
  @property({ type: Boolean }) opened: boolean = false

  static get styles(): CSSResult[] {
    return [
      css`
        :host {
          position: absolute;
          width: 0;
          height: 0;
        }
        #modal {
          display: none;
          width: 100vw;
          height: 100vh;
        }
        #modal[opened] {
          position: absolute;
          display: block;
          z-index: 1;
        }
        nav {
          position: relative;
          left: -100vw;
          background-color: var(--theme-light-color);
          width: 80vw;
          height: 100vh;
          z-index: 2;
          transition: left 0.3s ease-out 0.1s;
          display: flex;
          flex-direction: column;
        }
        nav[opened] {
          left: 0;
        }
        .menu-title {
          margin: auto 0;
          padding: 10px;
          text-align: center;
          color: var(--theme-darker-color);
        }
        .menu-container {
          flex: 1;
        }
        .menu-item {
          padding: 10px;
          display: grid;
          grid-template-columns: auto 1fr;
          grid-gap: 10px;
          border-top: 1px solid var(--theme-darker-color);
          font-style: italic;
        }
        .menu-item:active,
        .menu-item[activated] {
          background-color: var(--theme-primary-color);
        }
        .menu-item > * {
          margin: auto 0;
          color: var(--theme-darker-color);
        }
        .mailto {
          display: flex;
        }
        .mailto > a {
          padding: var(--theme-common-spacing, 5px);
          color: white;
          margin: auto 0;
          margin-left: auto;
        }
        .mailto > a > mwc-icon {
          color: var(--theme-darker-color);
        }
      `,
    ]
  }

  render(): TemplateResult {
    return html`
      <div id="modal" ?opened="${this.opened}" @click="${this.close}"></div>

      <nav ?opened="${this.opened}">
        <h2 class="menu-title">Branin Indexer</h2>
        <div class="menu-container">
          ${this.menus.map(
            (menu: Menu) => html`
              <div
                class="menu-item"
                @click="${() => this.menuClick(menu)}"
                ?activated="${location.pathname.replace(/^\//, '') === menu.route}"
              >
                <mwc-icon>${menu.icon}</mwc-icon>
                <span>${menu.title}</span>
              </div>
            `
          )}
        </div>
        <div class="mailto">
          <a href="mailto:jaylee.possible@gmail.com"><mwc-icon>email</mwc-icon></a>
        </div>
      </nav>
    `
  }

  constructor(menus: Menu[]) {
    super()
    this.menus = menus
    document.addEventListener('after-navigate', () => this.requestUpdate())
  }

  menuClick(menu: Menu) {
    this.dispatchEvent(
      new CustomEvent('menuClick', {
        detail: menu,
      })
    )
    this.close()
  }

  toggle(): void {
    this.opened = !this.opened
  }

  open(): void {
    this.opened = true
  }

  close(): void {
    this.opened = false
  }
}
