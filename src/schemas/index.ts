import { Schema } from './transaction-helper'
import { cardSchema } from './card'
import { categorySchema } from './category'
import { dailyChanllengeSchema } from './daily-challenge'
import { statisticSchema } from './statistic'

export * from './card'
export * from './category'
export * from './daily-challenge'
export * from './statistic'

export const schemas: Schema[] = [cardSchema, categorySchema, statisticSchema, dailyChanllengeSchema]
