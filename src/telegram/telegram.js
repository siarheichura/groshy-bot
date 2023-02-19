import { Telegraf, session, Scenes } from 'telegraf'
import { CONFIG } from '../config.js'
import { operationScene } from './scenes/operation.scene.js'
import { reportsScene } from './scenes/reports.scene.js'
import { REPORT_NAMES } from '../constants.js'
import { getWallets, getAllCategories } from '../google-spreadsheet/google-spreadsheet.js'
import { startCommandHandler, hearsReportNameHandler, onTextHandler } from './controllers/telegram.controller.js'

const bot = new Telegraf(CONFIG.TELEGRAM_API_TOKEN)

export const startBot = async () => {
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
