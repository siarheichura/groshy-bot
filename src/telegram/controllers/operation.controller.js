import { Markup } from 'telegraf'
import { getOperationDataFromMessage, getAddOperationReplyMessage } from '../services/operation.service.js'
import { MESSAGES } from '../constants/messages.contants.js'
import { INLINE_KEYBOARD } from '../constants/bot.constants.js'

export const enterSceneHandler = async ctx => {
  const { doc } = ctx.session.user
  const { text } = ctx.message

  const operation = await getOperationDataFromMessage(text)
  if (!operation) {
    return ctx.reply(MESSAGES.NO_SUM)
  }

  const mainWallet = await doc.getMainWallet()
  const categories = await doc.getCategories(operation.type)
  const categoryNamesArray = categories.map(category => category.name)
  ctx.session.operation = {
    ...operation,
    wallet: mainWallet.name,
    currency: mainWallet.currency
  }

  const categories_keyboard = categoryNamesArray.map(category =>
    ({ text: category, callback_data: `category ${category}` })
  )

  await ctx.replyWithHTML(
    MESSAGES.CHOOSE_CATEGORY,
    Markup.inlineKeyboard(categories_keyboard, { columns: 2 })
  )
}

export const categoryButtonClickHandler = async (ctx) => {
  const category = ctx.match.input.replace('category', '').trim()
  const operation = { ...ctx.session.operation, category }
  const { doc } = ctx.session.user

  await doc.addOperation(operation)
  const wallets = await doc.getWallets()

  await ctx.deleteMessage()
  ctx.replyWithHTML(
    getAddOperationReplyMessage(operation, wallets),
    Markup.inlineKeyboard([INLINE_KEYBOARD.CANCEL_DELETE_LAST])
  )
  ctx.answerCbQuery()
}

export const cancelOperationHandler = async (ctx) => {
  const { type } = ctx.session.operation
  const { doc } = ctx.session.user

  await doc.deleteLastOperation(type)
  ctx.answerCbQuery()
  ctx.editMessageText(MESSAGES.CANCELED)
}
