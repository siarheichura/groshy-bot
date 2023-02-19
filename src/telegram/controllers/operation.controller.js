const { getOperationDataFromMessage, getAddOperationReplyMessage } = require('../services/operation.service')
const { ERROR_MESSAGES } = require('../../constants')
const { Markup } = require('telegraf')
const { addOperation, getWallets, deleteLastOperation } = require('../../google-spreadsheet/google-spreadsheet')

const enterSceneHandler = async ctx => {
  const { wallets } = ctx.session
  const mainWallet = wallets.find(wallet => wallet.isMain)
  const { text } = ctx.message

  const operation = await getOperationDataFromMessage(text)
  if (!operation) {
    return ctx.reply(ERROR_MESSAGES.NO_SUM)
  }
  ctx.session.operation = {
    ...operation,
    wallet: mainWallet.name,
    currency: mainWallet.currency
  }

  const categories = operation.type
    ? ctx.session.categories.income
    : ctx.session.categories.expense

  const categories_keyboard = categories.map(category =>
    ({ text: category, callback_data: `category ${category}` })
  )

  await ctx.replyWithHTML(
    '<b>📄Выберы катэгорыю</b>',
    Markup.inlineKeyboard(categories_keyboard, { columns: 2 })
  )
}

const categoryButtonClickHandler = async (ctx) => {
  const category = ctx.match.input.replace('category', '').trim()

  const operation = { ...ctx.session.operation, category }

  await addOperation(operation)

  const wallets = await getWallets()
  ctx.session.wallets = wallets

  await ctx.deleteMessage()
  ctx.replyWithHTML(
    getAddOperationReplyMessage(operation, wallets),
    Markup.inlineKeyboard([{ text: '🚫 Адмяніць', callback_data: 'DeleteLast' }])
  )
  ctx.answerCbQuery()
}

const cancelOperationHandler = async (ctx) => {
  const { type } = ctx.session.operation

  await deleteLastOperation(type)

  ctx.answerCbQuery()
  ctx.editMessageText('❌ Адменена')
}

module.exports = {
  enterSceneHandler,
  categoryButtonClickHandler,
  cancelOperationHandler
}
