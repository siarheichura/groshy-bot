import { startBot } from './src/telegram/telegram.js'
import { startSpreadsheet } from './src/google-spreadsheet/google-spreadsheet.js'

const startProject = async () => {
  try {
    await startSpreadsheet()
    console.log('Spreadsheet started...')

    startBot()
    console.log('Bot started...')
  } catch (err) {
    console.log('Failed starting project', err)
  }
}

startProject()
