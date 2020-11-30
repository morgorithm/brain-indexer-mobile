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
    icon: 'bar_chart',
    title: 'Statistics',
    route: 'statistics',
  },
  {
    icon: 'settings',
    title: 'Setting',
    route: 'settings',
  },
]

export interface DatabaseConfiguration {
  name: string
  version: number
}

export const DATABASE: DatabaseConfiguration = {
  name: 'brain-indexer-database',
  version: 4,
}
