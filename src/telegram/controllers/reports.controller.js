import dayjs from 'dayjs'
import { Markup } from 'telegraf'
import { getReportByCategoriesReplyMessage } from '../services/reports.service.js'

export const enterSceneHandler = async (ctx) => {
  const match = ctx.match.input.toLowerCase()
  const type = match.includes('даходы')
  const currDate = dayjs()

  const { doc } = ctx.session.user
  const reportData = await doc.getReportByCategories(type, currDate)
  const totalSum = reportData.reduce((curr, prev) => curr + +prev.sum, 0)

  const replyMessage = getReportByCategoriesReplyMessage(reportData, type, currDate, totalSum)

  const keyboard = [
    { text: '<<<', callback_data: 'previous' },
    { text: '>>>', callback_data: 'next' }
  ]

  return ctx.replyWithHTML(
    replyMessage,
    Markup.inlineKeyboard(keyboard, { columns: 2 }).resize()
  )
}
