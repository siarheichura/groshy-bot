import express from 'express'
import { CONFIG } from './config'
import { bot } from './telegram'

const app = express()

app.use(bot.webhookCallback(`/${CONFIG.TG.TOKEN}`))

app.get('/', (req, res) => res.send('heeeey'))

export default app
