import { CardEntity, cardSchema } from './card'
import { CategoryEntity, categorySchema } from './category'

export * from './card'
export * from './category'

export const schemas = [cardSchema, categorySchema]

export const Card: CardEntity = new CardEntity()
export const Category: CategoryEntity = new CategoryEntity()
