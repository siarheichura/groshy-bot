const { Telegraf, session, Scenes, Markup } = require('telegraf')
const { CONFIG } = require('../config')
const { operationScene } = require('./scenes/operation.scene')
const { reportsScene } = require('./scenes/reports.scene')
const { SCENES, MY_DOC_LINK, REPLY_KEYBOARD_VALUES, REPORT_NAMES } = require('../constants')
const { getWallets, getAllCategories } = require('../google-spreadsheet/google-spreadsheet')

const bot = new Telegraf(CONFIG.TELEGRAM_API_TOKEN)

const startBot = async () => {
  const stage = new Scenes.Stage([operationScene, reportsScene])

  bot.use(session())
  bot.use(stage.middleware())

  const wallets = await getWallets()
  const categories = await getAllCategories()

  bot.command('start', async ctx => await startCommandHandler(ctx))
  // bot.command('start', async ctx => ctx.scene.enter(SCENES.OPERATION, initialState))
  bot.hears(REPORT_NAMES, ctx => ctx.scene.enter(SCENES.REPORTS))
  bot.on('text', ctx => {
    ctx.session.wallets = wallets
    ctx.session.categories = {
      expense: categories.filter(category => !category.type).map(category => category.name),
      income: categories.filter(category => category.type).map(category => category.name)
    }
    return ctx.scene.enter(SCENES.OPERATION)
  })

  await bot.launch()

  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}

const startCommandHandler = async ctx => {
  await ctx.telegram.setMyCommands([
    { command: 'start', description: 'start command' }
  ])

  const keyboard = REPLY_KEYBOARD_VALUES.map(i => ({ text: i }))
  const replyMessage = `<a href='${MY_DOC_LINK}'>Твая таблічка</a>📝`

  return ctx.replyWithHTML(
    replyMessage,
    Markup.keyboard(keyboard, { columns: 2 }).resize()
  )
}

module.exports = {
  startBot
}



