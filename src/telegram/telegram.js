// import { Telegraf, session, Scenes } from 'telegraf'
// import { CONFIG } from '../config.js'
// import { OperationModel, UserModel } from '../modelsMongo/User.js'
//
// const bot = new Telegraf(CONFIG.TELEGRAM_API_TOKEN)
//
// export const startBot = async () => {
//   const stage = new Scenes.Stage([
//     registrationScene,
//     operationScene,
//     reportsScene
//   ])
//
//   bot.use(session())
//   // bot.use(stage.middleware())
//   // bot.use(authMiddleware)
//   //
//   // bot.command(BOT_COMMANDS.START, startCommandHandler)
//   // bot.hears(REGEXPS.BALANCE, hearsBalanceHandler)
//   // bot.hears(REPORT_NAMES, hearsReportNameHandler)
//   // bot.hears(REGEXPS.ANY, onTextHandler)
//
//   bot.use(async (ctx, next) => {
//     try {
//       const { id: chatId } = ctx.chat
//       const isUserExist = await UserModel.findOne({ chatId })
//
//       if (isUserExist) {
//         return next()
//       } else {
//         const { username, first_name: firstName, last_name: lastName } = ctx.from
//         const expenseCategories = basicCategories.expense.map(category => ({ type: 'expense', name: category }))
//         const incomeCategories = basicCategories.income.map(category => ({ type: 'income', name: category }))
//         await UserModel.create({
//           chatId,
//           username,
//           firstName,
//           lastName,
//           categories: [...expenseCategories, ...incomeCategories]
//         })
//         await ctx.reply('new user created')
//         return next()
//       }
//     } catch (err) {
//       console.log(err)
//       return ctx.reply('Something went wrong :( please try again or connect support')
//     }
//   })
//
//   bot.command('start', async ctx => {
//     ctx.reply(
//       'started'
//       // Markup.keyboard([
//       //   {
//       //     text: 'Wallet settings',
//       //     web_app: { url: 'https://www.youtube.com/' }
//       //   }
//       // ]).resize()
//     )
//   })
//
//
//   bot.action(/^category/, async ctx => {
//     const { id: chatId } = ctx.chat
//     const user = await UserModel.findOne({ chatId })
//     const category = ctx.match.input.replace('category', '').trim()
//     const operation = { ...ctx.session.operation, category, user: user.id }
//     await OperationModel.create(operation)
//
//     await UserModel.findOneAndUpdate(
//       { chatId },
//       { $inc: { 'wallet.balance': operation.type === 'income' ? operation.sum : -operation.sum } }
//     )
//
//     const updatedUser = await UserModel.findOne({ chatId })
//
//     console.log('UPD USER:', updatedUser.wallet)
//
//     const replyMessage = `` +
//       `<code>------------------------------</code>\n` +
//       `<b>Дададзены новы ${operation.type === 'income' ? 'даход➕' : 'выдатак➖'}:</b>\n` +
//       `<b>📝Катэгорыя:</b> <pre>${operation.category}</pre>\n` +
//       `<b>💵Сума:</b> <pre>${operation.sum}GEL</pre>\n` +
//       `<b>💬Каментар:</b> <pre>${operation.comment || ' '}</pre>\n` +
//       `<code>------------------------------</code>\n` +
//       `<b>⚖️Мой баланс: ${updatedUser.wallet.balance}</b>\n` +
//       `<code>------------------------------</code>\n`
//
//     await ctx.deleteMessage()
//     await ctx.replyWithHTML(
//       replyMessage,
//       Markup.inlineKeyboard([INLINE_KEYBOARD.CANCEL_DELETE_LAST])
//     )
//     await ctx.answerCbQuery()
//   })
//
//   bot.hears(/.+/, async ctx => {
//     const { id: chatId } = ctx.chat
//     const { text } = ctx.message
//     const type = text[0] === '+' ? 'income' : 'expense'
//     let [sum, ...comment] = text.split(' ')
//     comment = comment.join(' ')
//     sum = +sum.replace(',', '.')
//
//     if (isNaN(sum)) {
//       return ctx.reply('no sum')
//     }
//
//     ctx.session = { operation: { type, sum, comment } }
//
//     const { categories } = await UserModel.findOne({ chatId }, { _id: 0, categories: 1 })
//     const categoriesByType = categories.filter(category => category.type === type)
//
//     const categories_keyboard = categoriesByType.map(category =>
//       ({ text: category.name, callback_data: `category ${category.name}` })
//     )
//
//     ctx.replyWithHTML(
//       MESSAGES.CHOOSE_CATEGORY,
//       Markup.inlineKeyboard(categories_keyboard, { columns: 2 })
//     )
//   })
//
//   await bot.launch()
//
//   process.once('SIGINT', () => bot.stop('SIGINT'))
//   process.once('SIGTERM', () => bot.stop('SIGTERM'))
// }
