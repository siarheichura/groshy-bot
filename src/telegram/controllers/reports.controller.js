import dayjs from 'dayjs'
import { Markup } from 'telegraf'
import { getReportByCategoriesReplyMessage } from '../services/reports.service.js'
import { REPORTS } from '../constants/shared.constants.js'

const inline_keyboard = [[
  { text: '<<<', callback_data: 'previous' },
  { text: '>>>', callback_data: 'next' }
]]

export const enterSceneHandler = async (ctx) => {
  const type = ctx.match[0] === REPORTS.INCOMES_BY_CATEGORIES
  const currDate = dayjs()
  const { doc } = ctx.session.user
  const report = await doc.getReportByCategories(type, currDate)

  const replyMessage = getReportByCategoriesReplyMessage(report.data, type, currDate, report.total)

  ctx.session.report = { date: currDate, type }
  return ctx.replyWithHTML(
    replyMessage,
    Markup.inlineKeyboard(inline_keyboard).resize()
  )
}

export const nextPreviousHandler = async (ctx) => {
  const isNext = ctx.match[0] === 'next'
  const { date, type } = ctx.session.report
  const newDate = isNext ? date.add(1, 'month') : date.subtract(1, 'month')

  const { doc } = ctx.session.user
  const report = await doc.getReportByCategories(type, newDate)

  const replyMessage = getReportByCategoriesReplyMessage(report.data, type, newDate, report.total)
  ctx.session.report.date = newDate

  const { id: chatId } = ctx.chat
  const { message_id: messageId } = ctx.update.callback_query.message

  await ctx.telegram.editMessageText(
    chatId,
    messageId,
    '',
    replyMessage,
    {
      reply_markup: { inline_keyboard },
      parse_mode: 'HTML'
    }
  )
}

export const leaveSceneHandler = (ctx) => {
  delete ctx.session.report
}
