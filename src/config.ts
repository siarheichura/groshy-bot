import { config } from 'dotenv'

config()

export const CONFIG = {
  DB_URL: process.env.DB_URL!,
  DB_NAME: process.env.DB_NAME_DEV,
  TELEGRAM_API_TOKEN: process.env.TELEGRAM_API_TOKEN_DEV!,
  WEBHOOK_URL: `${process.env.WEBHOOK_URL}${process.env.TELEGRAM_API_TOKEN}`,
  IS_PROD: process.env.NODE_ENV === 'production',
  PORT: process.env.PORT || 4000
}
