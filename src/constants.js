const BASIC_CATEGORIES = [
  '🥐 Прадукты',
  '🏠 Кватэра',
  '💃 Забавы',
  '🏎️ Аўтамабіль',
  '🚌 Транспорт',
  '👕 Адзенне',
  '🎁 Падарункі',
  '💉 Лекі',
  '🗑️ Страты',
  '🧴 Гігіена',
  '🧹 Гаспадарчыя тавары',
  '💰 Іншае',

  '💳 Зарплата',
  '🎁 Падарункі',
  '💼 Бізнэс',
  '💰 Іншае'
]

const ERROR_MESSAGES = {
  NO_SUM: 'Гэй, забыўся ўвесці суму'
}

const DATE_FORMAT = 'DD.MM.YYYY'

const OPERATION_TYPES = {
  EXPENSES: 0,
  INCOMES: 1
}

const SHEETS = {
  EXPENSES: 0,
  INCOMES: 1,
  CATEGORIES: 2,
  WALLETS: 3,
  STATISTICS: 4
}

const SCENES = {
  OPERATION: 'OPERATION',
  REPORTS: 'REPORTS'
}

const MY_DOC_LINK = 'https://docs.google.com/spreadsheets/d/1kofFdAl6c58w0BjCkaiNaSdQ5LBR8NwgURfd2ajZJpw/edit#gid=597154558'

const REPLY_KEYBOARD_VALUES = [
  '⬅️Выдаткі па катэгорыях',
  '➡️Даходы па катэгорыях'
]
const REPORT_NAMES = [
  '⬅️Выдаткі па катэгорыях',
  '➡️Даходы па катэгорыях'
]

module.exports = {
  BASIC_CATEGORIES,
  ERROR_MESSAGES,
  DATE_FORMAT,
  OPERATION_TYPES,
  SHEETS,
  SCENES,
  MY_DOC_LINK,
  REPLY_KEYBOARD_VALUES,
  REPORT_NAMES
}


