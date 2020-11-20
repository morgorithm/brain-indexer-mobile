import { TemplateResult, html } from 'lit-element'

import { Menu } from '../components/side-menus'

export const Menus: Menu[] = [
  {
    icon: 'home',
    title: 'Home',
    route: '',
  },
  {
    icon: 'article',
    title: 'Card',
    route: 'cards',
  },
  {
    icon: 'topic',
    title: 'Category',
    route: 'categories',
  },
  {
    icon: 'insights',
    title: 'Statistics',
    route: 'statistics',
  },
  {
    icon: 'settings',
    title: 'Setting',
    route: 'settings',
  },
]

export const DATABASE: Record<string, any> = {
  name: 'brain-indexer-database',
  version: 1,
}
