const { startBot } = require('./src/telegram/telegram')
const { startSpreadsheet } = require('./src/google-spreadsheet/google-spreadsheet')

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
