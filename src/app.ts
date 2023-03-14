import mongoose from 'mongoose'
import app from './api'
import { startBot } from './telegram'
import { CONFIG } from './config'

const start = async (): Promise<void> => {
  try {
    await mongoose.connect(CONFIG.DB.URL, { dbName: CONFIG.DB.NAME })
    console.log('Connected to DB...')

    await startBot()
    console.log('Bot started...')

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
