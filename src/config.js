import { config } from 'dotenv'

config()

export const CONFIG = {
  TELEGRAM_API_TOKEN: process.env.TELEGRAM_API_TOKEN,

  GOOGLE_SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID,
  GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY
}
