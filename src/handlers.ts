import { Markup, Telegraf } from 'telegraf'
import dayjs from 'dayjs'
import { getReportByCategories, OperationModel, UserModel } from './models'
import { getReportByCategoriesReplyMessage, getReportDates, getReportKeyboard } from './services/report.service'
import { IContext, OperationType } from './interfaces'
import basicCategories from './assets/basicCategories.json'
import { MESSAGES } from './constants'

export const botHandlers = (bot: Telegraf<IContext>) => {
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

  bot.command('balance', async ctx => {
    const { id: chatId } = ctx.chat
    const user = await UserModel.findOne({ chatId })
    return ctx.replyWithHTML(MESSAGES.BALANCE(user!.wallet.balance))
  })

  bot.command('report', async ctx => {
    const { id: chatId } = ctx.chat
    const user = await UserModel.findOne({ chatId }, { _id: 1, categories: 1 })

    const date = dayjs()
    const type = 'expense'
    const reportDates = getReportDates(date)

    const report = await getReportByCategories(user!._id, type, reportDates.period)
    const message = getReportByCategoriesReplyMessage(type, report, date)
    const keyboard = getReportKeyboard(type, reportDates)

    return ctx.replyWithHTML(message, Markup.inlineKeyboard([keyboard]))
  })

  bot.action(/^report/, async ctx => {
    const { id: chatId } = ctx.chat!
    const user = await UserModel.findOne({ chatId }, { _id: 1, categories: 1 })
    const date = dayjs(ctx.match.input.split(' ')[1])
    const type = ctx.match.input.split(' ')[2] as OperationType

    const reportDates = getReportDates(date)
    const report = await getReportByCategories(user!._id, type, reportDates.period)
    const message = getReportByCategoriesReplyMessage(type, report, date)
    const keyboard = getReportKeyboard(type, reportDates)

    await ctx.deleteMessage()
    return ctx.replyWithHTML(message, Markup.inlineKeyboard([keyboard]))
  })

  bot.action(/^category/, async ctx => {
    const { id: chatId } = ctx.chat!
    const category = ctx.match.input.replace('category', '').trim()
    const operation: any = { ...ctx.session.operation, category }
    const { updBalance } = ctx.session
    const addedOperation = await OperationModel.create(operation)

    await UserModel.findOneAndUpdate({ chatId }, { 'wallet.balance': updBalance })

    ctx.session = {}
    await ctx.deleteMessage()
    await ctx.replyWithHTML(
      MESSAGES.OPERATION_ADDED(operation) + MESSAGES.BALANCE(updBalance!),
      Markup.inlineKeyboard([{ text: '🚫Адмяніць', callback_data: `delete_last ${addedOperation.id}` }])
    )
    await ctx.answerCbQuery()
  })

  bot.action(/^delete_last/, async ctx => {
    const { id: chatId } = ctx.chat!
    const { data } = ctx.callbackQuery as { data: string }
    const operationId = data.split(' ')[1]
    const operation = await OperationModel.findOneAndDelete({ _id: operationId })
    await UserModel.findOneAndUpdate(
      { chatId },
      { $inc: { 'wallet.balance': operation!.type === 'income' ? -operation!.sum : operation!.sum } }
    )
    return ctx.editMessageText('🚫Адмянена')
  })

  bot.on('text', async ctx => {
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
}
