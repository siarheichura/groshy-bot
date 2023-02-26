export const BOT_COMMANDS = {
  START: '/start'
}

export const ERROR_MESSAGES = {
  NO_SUM: 'Гэй, забыўся ўвесці суму'
}

export const DATE_FORMAT = 'DD.MM.YYYY'

export const OPERATION_TYPES = {
  EXPENSES: 0,
  INCOMES: 1
}

export const SHEETS = {
  EXPENSES: 0,
  INCOMES: 1,
  CATEGORIES: 2,
  WALLETS: 3,
  STATISTICS: 4
}

export const SCENES = {
  REGISTRATION: 'REGISTRATION',
  OPERATION: 'OPERATION',
  REPORTS: 'REPORTS'
}

export const REPLY_KEYBOARD_VALUES = (mainWalletBalance) => [
  ['⬅️Выдаткі па катэгорыях', '➡️Даходы па катэгорыях'],
  [`⚖️Мой баланс: ${mainWalletBalance}`]
]
export const REPORT_NAMES = [
  '⬅️Выдаткі па катэгорыях',
  '➡️Даходы па катэгорыях'
]
