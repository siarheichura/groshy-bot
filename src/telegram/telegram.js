import { Telegraf, session, Scenes } from 'telegraf'
import { CONFIG } from '../config.js'
import { operationScene } from './scenes/operation.scene.js'
import { reportsScene } from './scenes/reports.scene.js'
import { registrationScene } from './scenes/registration.scene.js'
import { BOT_COMMANDS, REPORT_NAMES } from '../constants.js'
import {
  startCommandHandler,
  hearsReportNameHandler,
  onTextHandler,
  hearsBalanceHandler
} from './controllers/telegram.controller.js'
import { authMiddleware } from './middlewares/auth.middleware.js'

const bot = new Telegraf(CONFIG.TELEGRAM_API_TOKEN)

export const startBot = async () => {
  const stage = new Scenes.Stage([
    operationScene,
    reportsScene,
    registrationScene
  ])

  bot.use(session())
  bot.use(stage.middleware())

  bot.use(async (ctx, next) => authMiddleware(ctx, next))

  bot.command(BOT_COMMANDS.START, async ctx => await startCommandHandler(ctx))
  bot.hears(/⚖️Мой баланс/i, async ctx => await hearsBalanceHandler(ctx))
  bot.hears(REPORT_NAMES, ctx => hearsReportNameHandler(ctx))
  bot.on('text', ctx => onTextHandler(ctx))

  await bot.launch()

  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}
