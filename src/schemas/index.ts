import { Schema } from './transaction-helper'
import { cardSchema } from './card'
import { categorySchema } from './category'
import { statisticSchema } from './statistic'

export * from './card'
export * from './category'
export * from './statistic'

export const schemas: Schema[] = [cardSchema, categorySchema, statisticSchema]
// export const schemas: Schema[] = [cardSchema, categorySchema]
