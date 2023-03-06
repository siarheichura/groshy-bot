import mongoose from 'mongoose'
import { startTgBot } from './tg.js'

const DB_URL = 'mongodb+srv://siarheichura:Nastyshka-14@hrosyclaster.iqdoeht.mongodb.net'

const start = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'hrosy'
    })

    startTgBot()
    console.log('Bot started...')
  } catch (err) {
    console.log('Failed starting project', err)
  }
}

start().catch()
