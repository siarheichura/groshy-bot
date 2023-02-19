import dayjs from 'dayjs'
import { Markup } from 'telegraf'
import { getReportByCategories } from '../../google-spreadsheet/google-spreadsheet.js'
import { getReportByCategoriesReplyMessage } from '../services/reports.service.js'

export const enterSceneHandler = async (ctx) => {
  const match = ctx.match.input.toLowerCase()
  const isExpense = match.includes('выдаткі')
  const currDate = dayjs()

  const reportData = await getReportByCategories(isExpense, currDate)
  const totalSum = reportData.reduce((curr, prev) => curr + +prev.sum, 0)

  const replyMessage = getReportByCategoriesReplyMessage(reportData, isExpense, currDate, totalSum)

  const keyboard = [
    { text: '<<<', callback_data: 'previous' },
    { text: '>>>', callback_data: 'next' }
  ]

  return ctx.replyWithHTML(
    replyMessage,
    Markup.inlineKeyboard(keyboard, { columns: 2 }).resize()
  )
}
