const { Telegraf, session, Scenes } = require('telegraf')
const { CONFIG } = require('../config')
const { operationScene } = require('./scenes/operation.scene')
const { reportsScene } = require('./scenes/reports.scene')
const { REPORT_NAMES } = require('../constants')
const { getWallets, getAllCategories } = require('../google-spreadsheet/google-spreadsheet')
const { startCommandHandler, hearsReportNameHandler, onTextHandler } = require('./controllers/telegram.controller')

const bot = new Telegraf(CONFIG.TELEGRAM_API_TOKEN)

const startBot = async () => {
  const stage = new Scenes.Stage([operationScene, reportsScene])

  bot.use(session())
  bot.use(stage.middleware())

  const wallets = await getWallets()
  const categories = await getAllCategories()

  bot.command('start', async ctx => await startCommandHandler(ctx))
  bot.hears(REPORT_NAMES, ctx => hearsReportNameHandler(ctx))
  bot.on('text', ctx => onTextHandler(ctx, { wallets, categories }))

  await bot.launch()

  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}

module.exports = {
  startBot
}



