const { Scenes } = require('telegraf')
const { SCENES, ERROR_MESSAGES } = require('../../constants')
const {
  getOperationDataFromMessage,
  getCategoriesButtons,
  getAddOperationReplyMessage
} = require('../services/operation.service')
const { addOperation, deleteLastOperation, getWallets } = require('../../google-spreadsheet/google-spreadsheet')

const operationScene = new Scenes.BaseScene(SCENES.OPERATION)

operationScene.enter(async ctx => {
  const { wallets } = ctx.session
  const { text } = ctx.message

  const operation = await getOperationDataFromMessage(text, wallets)
  if (!operation) {
    return ctx.reply(ERROR_MESSAGES.NO_SUM)
  }
  ctx.session.operation = operation

  const categories = operation.type
    ? ctx.session.categories.income
    : ctx.session.categories.expense

  const categoriesKeyboard = getCategoriesButtons(categories)

  await ctx.reply('Выберы катэгорыю', {
    reply_markup: {
      inline_keyboard: categoriesKeyboard
    }
  })
})

operationScene.action(new RegExp('^category'), async ctx => {
  const category = ctx.match.input.replace('category', '').trim()

  const operation = { ...ctx.session.operation, category }

  await addOperation(operation)

  const updatedBalanceWallets = await getWallets()
  ctx.session.wallets = updatedBalanceWallets
  await ctx.deleteMessage()
  ctx.reply(getAddOperationReplyMessage(operation, updatedBalanceWallets), {
    reply_markup: {
      inline_keyboard: [[{ text: '🚫 Адмяніць', callback_data: 'DeleteLast' }]]
    },
    parse_mode: 'HTML'
  })
  ctx.answerCbQuery()
})

operationScene.action(['Cancel', 'DeleteLast'], async ctx => {
  const { type } = ctx.session.operation

  if (ctx.match[0] === 'DeleteLast') {
    await deleteLastOperation(type)
  }
  ctx.answerCbQuery()
  ctx.editMessageText('❌ Адменена')
})

operationScene.leave(() => {
  console.log('left operation scene')
})

module.exports = {
  operationScene
}
