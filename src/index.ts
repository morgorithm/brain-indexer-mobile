import './assets/styles/styles.css'
import './components/side-menus'
import './layouts'
import './pages'

import { CSSResult, LitElement, TemplateResult, css, customElement, html, property } from 'lit-element'
import { DATABASE, Menus } from './constants'
import { IndexedDB, Router } from './utils'

import { SideMenus } from './components/side-menus'
import { commonStyle } from './assets/styles/common-style'
import { schemas } from './schemas'

@customElement('brain-indexer')
export class BrainIndexer extends LitElement {
  @property({ type: Object }) router: Router = new Router()
  @property({ type: Object }) indexedDB: IndexedDB = new IndexedDB(DATABASE.name, schemas, DATABASE.version)

  static get styles(): CSSResult[] {
    return [
      commonStyle,
      css`
        :host {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: var(--theme-dark-color);
          overflow: hidden;
        }
        layout-content {
          flex: 1;
        }
      `,
    ]
  }

  render(): TemplateResult {
    return html`
      <side-menus @menuClick="${this.route}" .menus="${Menus}"></side-menus>

      <layout-header @menuIconClick="${this.onMenuIconClick}"></layout-header>

      <layout-content>
        <page-home></page-home>
        <page-cards></page-cards>
        <page-categories></page-categories>
        <page-404></page-404>
      </layout-content>

      <layout-footer></layout-footer>
    `
  }

  constructor() {
    super()
    this.indexedDB.createDatabase()
  }

  onMenuIconClick(): void {
    const sideMenus: SideMenus | null = this.renderRoot.querySelector('side-menus')
    if (sideMenus) {
      sideMenus.toggle()
    }
  }

  route(e: CustomEvent): void {
    const { title, route } = e.detail
    this.router.navigate(title, route)
  }
}
