import { config } from 'dotenv'

config()

export const CONFIG = {
  DB: {
    URL: process.env.DB_URL!,
    NAME: process.env.DB_NAME,
  },
  TG: {
    TOKEN: process.env.TELEGRAM_API_TOKEN!,
    WEBHOOK_URL: `${process.env.WEBHOOK_URL}${process.env.TELEGRAM_API_TOKEN}`,
  },
  IS_PROD: process.env.NODE_ENV === 'production',
  PORT: process.env.PORT || 4000
}
