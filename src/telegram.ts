import { Telegraf, session } from 'telegraf'
import { IContext } from './interfaces'

import { BOT_COMMANDS } from './constants'
import { CONFIG } from './config'
import { botHandlers } from './handlers'

export const bot = new Telegraf<IContext>(CONFIG.TG.TOKEN)

export const startBot = async (): Promise<void> => {
  bot.use(session())
  await bot.telegram.setMyCommands(BOT_COMMANDS)

  botHandlers(bot)

  if (!CONFIG.IS_PROD) {
    bot.launch()
    console.log('Bot polling for updates..')
  } else {
    bot.telegram.setWebhook(CONFIG.TG.WEBHOOK_URL)
  }
}
