import { Telegraf, session, Scenes } from 'telegraf'
import { CONFIG } from '../config.js'

import { authMiddleware } from './middlewares/auth.middleware.js'
import { operationScene } from './scenes/operation.scene.js'
import { reportsScene } from './scenes/reports.scene.js'
import { registrationScene } from './scenes/registration.scene.js'
import {
  startCommandHandler,
  hearsReportNameHandler,
  onTextHandler,
  hearsBalanceHandler,
} from './controllers/telegram.controller.js'

import { REGEXPS } from './constants/regexps.constants.js'
import { BOT_COMMANDS } from './constants/bot.constants.js'
import { REPORT_NAMES } from './constants/shared.constants.js'


const bot = new Telegraf(CONFIG.TELEGRAM_API_TOKEN)

export const startBot = async () => {
  const stage = new Scenes.Stage([
    registrationScene,
    operationScene,
    reportsScene
  ])

  bot.use(session())
  bot.use(stage.middleware())
  bot.use(authMiddleware)

  bot.command(BOT_COMMANDS.START, startCommandHandler)
  bot.hears(REGEXPS.BALANCE, hearsBalanceHandler)
  bot.hears(REPORT_NAMES, hearsReportNameHandler)
  bot.hears(REGEXPS.ANY, onTextHandler)

  await bot.launch()

  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}
