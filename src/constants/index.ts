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
    icon: 'settings',
    title: 'Setting',
    route: 'settings',
  },
]
