import { Telegraf, session, Markup } from 'telegraf'
import { OperationModel, UserModel } from './models'
import { IContext } from './interfaces'

import basicCategories from './assets/basicCategories.json'
import { BOT_COMMANDS, MESSAGES } from './constants'
import { CONFIG } from './config'

export const startBot = async (bot: Telegraf<IContext>): Promise<void> => {
  bot.use(session())
  await bot.telegram.setMyCommands(BOT_COMMANDS)

  bot.command('start', async ctx => {
    const { id: chatId } = ctx.chat
    const { username, first_name: firstName, last_name: lastName } = ctx.from
    const user = await UserModel.findOne({ chatId })
    if (!user) {
      const expenseCategories = basicCategories.expense.map(category => ({ type: 'expense', name: category }))
      const incomeCategories = basicCategories.income.map(category => ({ type: 'income', name: category }))
      await UserModel.create({
        chatId,
        username,
        firstName,
        lastName,
        categories: [...expenseCategories, ...incomeCategories]
      })
    }
    return ctx.replyWithHTML(MESSAGES.GREETING(username!))
    // Markup.keyboard([{ text: 'Wallet settings', web_app: { url: 'https://www.youtube.com/' } }]).resize()
  })

  bot.action(/^category/, async ctx => {
    const { id: chatId } = ctx.chat!
    const category = ctx.match.input.replace('category', '').trim()
    const operation: any = { ...ctx.session.operation, category }
    const { updBalance } = ctx.session
    await OperationModel.create(operation)

    await UserModel.findOneAndUpdate({ chatId }, { 'wallet.balance': updBalance })

    ctx.session = {}
    await ctx.deleteMessage()
    await ctx.replyWithHTML(
      MESSAGES.OPERATION_ADDED(operation) + MESSAGES.BALANCE(updBalance!),
      Markup.inlineKeyboard([{ text: '🚫Адмяніць', callback_data: 'deleteLast' }])
    )
    await ctx.answerCbQuery()
  })

  bot.command('balance', async ctx => {
    const { id: chatId } = ctx.chat!
    const user = await UserModel.findOne({ chatId })
    return ctx.replyWithHTML(MESSAGES.BALANCE(user!.wallet.balance))
  })

  bot.hears(/.+/, async ctx => {
    const { id: chatId } = ctx.chat
    const { text } = ctx.message
    const type = text[0] === '+' ? 'income' : 'expense'
    let [splitSum, ...splitComment] = text.split(' ')

    const sum = +splitSum.replace(',', '.')
    const comment = splitComment.join(' ')

    if (isNaN(sum)) {
      return ctx.reply('no sum')
    }

    const user = await UserModel.findOne({ chatId })
    if (!user) {
      return ctx.reply('no user')
    }
    const categoriesByType = user.categories.filter(category => category.type === type)

    const categories_keyboard = categoriesByType.map(category =>
      ({ text: category.name, callback_data: `category ${category.name}` })
    )

    const updBalance = type === 'income' ? user.wallet.balance + sum : user.wallet.balance - sum
    ctx.session = {
      operation: { type, sum, comment, user: user.id },
      updBalance
    }

    return ctx.replyWithHTML(
      '<b>📄Выберы катэгорыю</b>',
      Markup.inlineKeyboard(categories_keyboard, { columns: 2 })
    )
  })

  if (!CONFIG.IS_PROD) {
    bot.launch()
    console.log('Bot polling for updates..')
  } else {
    bot.telegram.setWebhook(CONFIG.WEBHOOK_URL)
  }
}
