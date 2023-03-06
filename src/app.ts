import { Telegraf } from 'telegraf'
import mongoose from 'mongoose'
import { CONFIG } from './config'
import { startBot } from './telegram'
import { IContext } from './interfaces'
import express from 'express'

export const bot = new Telegraf<IContext>(CONFIG.TELEGRAM_API_TOKEN)
export const app = express()
app.use(bot.webhookCallback(`/${CONFIG.TELEGRAM_API_TOKEN}`))

const start = async (): Promise<void> => {
  try {
    await mongoose.connect(CONFIG.DB_URL, { dbName: CONFIG.DB_NAME })
    console.log('Connected to DB...')

    await startBot(bot)
    console.log('Bot started...')

    // start API server
    app
      .listen(CONFIG.PORT, () => {
        console.info(`Server listening on port: ${CONFIG.PORT}`)
      })
      .on('error', (error) => {
        console.error(error)
        process.exit(1)
      })
  } catch (err) {
    console.log('Failed starting project', err)
    process.exit(1)
  }
}

start().catch()
