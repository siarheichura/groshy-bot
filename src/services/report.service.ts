import { Dayjs } from 'dayjs'
import { IInlineKeyboard, IReport, IReportDates, OperationType } from '../interfaces'

export const getReportByCategoriesReplyMessage = (type: OperationType, report: IReport | undefined, date: Dayjs): string => {
  const formatDate = date.format('MM.YYYY')
  if (!report) {
    return `Няма аперацый за ${formatDate}`
  }
  const headerTemplate = `<b>${type === 'expense' ? 'Выдаткі' : 'Даходы'} за ${formatDate}</b> \n`
  const reportTemplate = report.data.reduce(
    (prev, curr) => prev + `<pre>${curr.category}: ${curr.sum}</pre>\n`, ``
  )
  const totalSumTemplate = `<b>Агульная сума: ${report.total}</b>\n`

  return `` +
    `<pre>------------------------------</pre>\n` +
    `${headerTemplate}` +
    `<pre>------------------------------</pre>\n` +
    `${reportTemplate}` +
    `<pre>------------------------------</pre>\n` +
    `${totalSumTemplate}` +
    `<pre>------------------------------</pre>`
}

export const getReportDates = (date: Dayjs): IReportDates => {
  return {
    prev: date.subtract(1, 'month'),
    next: date.add(1, 'month'),
    curr: date,
    period: {
      start: date.startOf('month'),
      end: date.endOf('month')
    }
  }
}

export const getReportKeyboard = (type: OperationType, dates: IReportDates): IInlineKeyboard[] => {
  const typeButtonText = `${type === 'expense' ? 'Даходы' : 'Выдаткі'}`
  const typeButtonCallback = `${type === 'expense' ? 'income' : 'expense'}`
  return [
    { text: '<<<', callback_data: `report ${dates.prev.format()} ${type}` },
    { text: typeButtonText, callback_data: `report ${dates.curr.format()} ${typeButtonCallback}` },
    { text: '>>>', callback_data: `report ${dates.next.format()} ${type}` }
  ]
}
