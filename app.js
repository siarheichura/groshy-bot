import { startBot } from './src/telegram/telegram.js'
import { AdminDoc } from './src/models/AdminDoc.js'
import { CONFIG } from './src/config.js'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'

dayjs.extend(customParseFormat)

export const AdminGoogleDoc = new AdminDoc(CONFIG.ADMIN_GOOGLE_SPREADSHEET_ID)

const startProject = async () => {
  try {
    await AdminGoogleDoc.start()
    console.log('Spreadsheet started...')

    startBot()
    console.log('Bot started...')
  } catch (err) {
    console.log('Failed starting project', err)
  }
}

startProject()
