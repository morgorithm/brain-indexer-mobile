import '../components/simple-data-table'

import { CSSResult, TemplateResult, css, customElement, html, property } from 'lit-element'
import { Category, Statistic, StatisticEntity } from '../schemas'

import { Page } from './page'
import { TableCaption } from '../components/simple-data-table'
import { commonStyle } from '../assets/styles/common-style'
import { pageCommonStyle } from '../assets/styles/page-common-style'

declare type TotalStatistics = {
  tries: number
  pass: number
  fail: number
  rate: string
}

declare type StatisticByCategory = {
  category: string
  tries: number
  pass: number
  fail: number
  rate: string
}

@customElement('page-statistics')
export class PageStatistics extends Page {
  @property({ type: Object }) totalTableCaption: TableCaption = { caption: 'Total Rate' }
  @property({ type: Object }) byCategoryTableCaption: TableCaption = { caption: 'Rate by Category' }
  @property({ type: Array }) byTotalFields: string[] = ['tries', 'pass', 'fail', 'rate']
  @property({ type: Array }) byCategoryFields: string[] = ['category', 'tries', 'pass', 'fail', 'rate']
  @property({ type: Array }) byTotalData: TotalStatistics[] = []
  @property({ type: Array }) byCategoryData: StatisticByCategory[] = []
  @property({ type: Number }) totalTries: number = 0
  @property({ type: Number }) totalPass: number = 0
  @property({ type: Number }) totalFail: number = 0

  static get styles(): CSSResult[] {
    return [
      commonStyle,
      pageCommonStyle,
      css`
        :host([show]) {
          display: block;
          grid-template-columns: 1fr;
        }
        simple-data-table {
          margin-bottom: var(--theme-wide-spacing, 10px);
        }
      `,
    ]
  }

  render(): TemplateResult {
    const byTotalFields: string[] = this.byTotalFields || []
    const byTotalData: TotalStatistics[] = this.byTotalData || []
    const byCategoryFields: string[] = this.byCategoryFields || []
    const data: StatisticByCategory[] = this.byCategoryData || []

    return html` <simple-data-table
        .caption="${this.totalTableCaption}"
        .fields="${byTotalFields}"
        .data="${byTotalData}"
        .numbering="${false}"
      ></simple-data-table>

      <simple-data-table
        .caption="${this.byCategoryTableCaption}"
        .fields="${byCategoryFields}"
        .data="${data}"
        .numbering="${false}"
      ></simple-data-table>`
  }

  constructor() {
    super('Statistics', 'statistics')
  }

  // pageUpdated(changedProps: PropertyValues) {}

  async pageActivated(): Promise<void> {
    const statistics: Statistic[] = await new StatisticEntity().find()
    this.byCategoryData = statistics.reduce((statisticResultList: StatisticByCategory[], statistic: Statistic) => {
      const { category, passed }: Statistic = statistic
      const index: number = statisticResultList.findIndex(
        (result: StatisticByCategory) => result.category === (statistic.category as Category).name
      )

      if (index >= 0) {
        statisticResultList[index].tries++
        if (statistic.passed) {
          statisticResultList[index].pass++
        } else {
          statisticResultList[index].fail++
        }
        statisticResultList[index].rate = `${(
          (statisticResultList[index].pass / statisticResultList[index].tries) *
          100
        ).toFixed(2)} %`
      } else {
        statisticResultList.push({
          category: (statistic.category as Category).name || '',
          tries: 1,
          pass: statistic.passed ? 1 : 0,
          fail: statistic.passed ? 0 : 1,
          rate: `${(statistic.passed ? 1 : (0 / 1) * 100).toFixed(2)} %`,
        })
      }
      return statisticResultList
    }, [])

    this.byTotalData = [
      this.byCategoryData.reduce(
        (byTotalData: TotalStatistics, byCategory: StatisticByCategory) => {
          byTotalData.tries += byCategory.tries
          byTotalData.pass += byCategory.pass
          byTotalData.fail += byCategory.fail
          byTotalData.rate = `${((byTotalData.pass / byTotalData.tries) * 100).toFixed(2)} %`
          return byTotalData
        },
        { tries: 0, pass: 0, fail: 0, rate: '' }
      ),
    ]
  }
}
