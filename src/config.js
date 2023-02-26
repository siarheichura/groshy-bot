import { config } from 'dotenv'

config()

export const CONFIG = {
  TELEGRAM_API_TOKEN: process.env.TELEGRAM_API_TOKEN_DEV,
  GOOGLE_CREDS: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
  },
  ADMIN_GOOGLE_SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID_ADMIN,
  GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY
}
