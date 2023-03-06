import { Telegraf, session, Markup } from 'telegraf'
import { CONFIG } from './src/config.js'
import { OperationModel, UserModel } from './src/modelsMongo/User.js'

const bot = new Telegraf(CONFIG.TELEGRAM_API_TOKEN)

import basicCategories from './src/basicCategories.json' assert { type: 'json' }
import { BOT_COMMANDS, INLINE_KEYBOARD } from './src/telegram/constants/bot.constants.js'
import { MESSAGES } from './src/telegram/constants/messages.contants.js'

export const startTgBot = async () => {
  bot.use(session())
  bot.use(async (ctx, next) => {
    try {
      const { id: chatId } = ctx.chat
      const text = ctx.message?.text

      const isUserExist = await UserModel.findOne({ chatId })

      if (isUserExist) {
        return next()
      } else if (!isUserExist && text === BOT_COMMANDS.START) {
        const { username, first_name: firstName, last_name: lastName } = ctx.from
        const expenseCategories = basicCategories.expense.map(category => ({ type: 'expense', name: category }))
        const incomeCategories = basicCategories.income.map(category => ({ type: 'income', name: category }))
        await UserModel.create({
          chatId,
          username,
          firstName,
          lastName,
          categories: [...expenseCategories, ...incomeCategories]
        })
        await ctx.reply('new user created')
        return next()
      } else {
        throw new Error('wtf?')
      }
    } catch (err) {
      console.log(err)
      return ctx.reply('Something went wrong :( please try again or connect support')
    }
  })

  bot.command('start', async ctx => {
    ctx.reply('greeting')
    // { reply_markup: { remove_keyboard: true } }
    // Markup.keyboard([
    //   {
    //     text: 'Wallet settings',
    //     web_app: { url: 'https://www.youtube.com/' }
    //   }
    // ]).resize()
  })

  bot.action(/^category/, async ctx => {
    const { id: chatId } = ctx.chat
    const category = ctx.match.input.replace('category', '').trim()
    const operation = { ...ctx.session.operation, category }
    const { balance } = ctx.session
    await OperationModel.create(operation)
    const updBalance = operation.type === 'income' ? balance + operation.sum : balance - operation.sum
    console.log('UPD: ', updBalance)

    await UserModel.findOneAndUpdate(
      { chatId },
      { 'wallet.balance': updBalance }
    )

    const replyMessage = `` +
      `<code>------------------------------</code>\n` +
      `<b>Дададзены новы ${operation.type === 'income' ? 'даход➕' : 'выдатак➖'}:</b>\n` +
      `<b>📝Катэгорыя:</b> <pre>${operation.category}</pre>\n` +
      `<b>💵Сума:</b> <pre>${operation.sum}GEL</pre>\n` +
      `<b>💬Каментар:</b> <pre>${operation.comment || ' '}</pre>\n` +
      `<code>------------------------------</code>\n` +
      `<b>⚖️Мой баланс: ${updBalance}GEL</b>\n` +
      `<code>------------------------------</code>\n`

    ctx.session = {}
    await ctx.deleteMessage()
    await ctx.replyWithHTML(
      replyMessage,
      Markup.inlineKeyboard([INLINE_KEYBOARD.CANCEL_DELETE_LAST])
    )
    await ctx.answerCbQuery()
  })

  bot.hears(/.+/, async ctx => {
    const { id: chatId } = ctx.chat
    const { text } = ctx.message
    const type = text[0] === '+' ? 'income' : 'expense'
    let [sum, ...comment] = text.split(' ')
    comment = comment.join(' ')
    sum = +sum.replace(',', '.')

    if (isNaN(sum)) {
      return ctx.reply('no sum')
    }

    const user = await UserModel.findOne({ chatId })
    const categoriesByType = user.categories.filter(category => category.type === type)

    const categories_keyboard = categoriesByType.map(category =>
      ({ text: category.name, callback_data: `category ${category.name}` })
    )

    ctx.session = {
      operation: { type, sum, comment, user: user.id },
      balance: user.wallet.balance
    }

    ctx.replyWithHTML(
      MESSAGES.CHOOSE_CATEGORY,
      Markup.inlineKeyboard(categories_keyboard, { columns: 2 })
    )
  })

  await bot.launch()

  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}
