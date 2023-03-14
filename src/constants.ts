import { IOperation } from './interfaces'

export const BOT_COMMANDS = [
  { command: 'start', description: 'heeeeey ;)' },
  { command: 'balance', description: 'show my balance' },
  { command: 'report', description: 'get month report by categories' }
]

export const MESSAGES = {
  GREETING: (username: string) =>
    `Прывітанне, <b>${username}!👋</b> Вельмі рады бачыць цябе тут🤗\n` +
    `\n` +
    `1. Адпраў мне выдатак у фармаце <b>[колькі] [каментар(не абавязкова)].</b> \n` +
    `2. Выберы патрэбную катэгорыю. \n` +
    `\n` +
    `(калі трэба дадаць даход, то проста дадай <b>'+'</b> перад сумай) \n` +
    `\n` +
    `🤍❤️🤍`,

  OPERATION_ADDED: (operation: IOperation) =>
    `<code>------------------------------</code>\n` +
    `<b>Дададзены новы ${operation.type === 'income' ? 'даход➕' : 'выдатак➖'}:</b>\n` +
    `<b>📝Катэгорыя:</b> <pre>${operation.category}</pre>\n` +
    `<b>💵Сума:</b> <pre>${operation.sum}GEL</pre>\n` +
    `<b>💬Каментар:</b> <pre>${operation.comment || ' '}</pre>\n`,

  BALANCE: (balance: number) =>
    `<code>------------------------------</code>\n` +
    `<b>⚖️Мой баланс: ${balance}GEL</b>\n` +
    `<code>------------------------------</code>\n`,

  CATEGORIES_SETTING: (categories: { expense: string[], income: string[] }) => {
    const expenseCategoriesString = categories.expense.reduce((prev, curr) => prev + `<pre>${curr}</pre>` + ' | ', '')
    const incomeCategoriesString = categories.income.reduce((prev, curr) => prev + `<pre>${curr}</pre>` + ' | ', '')

    return 'Каб <u>дадаць катэгорыю</u>, адпраў мне паведамленне ў наступным фармаце: \n' +
      '<b>[add category] [expense / income] [Назва катэгорыі]</b>\n' +
      '(напрыклад, <pre>add category expense 🍔Фаст фуд</pre>)\n' +
      '\n' +
      'Каб <u>выдаліць катэгорыю</u>, адпраў мне паведамленне ў наступным фармаце:\n' +
      '<b>[delete category] [expense / income] [Назва катэгорыі]</b>\n' +
      '(напрыклад, <pre>delete category income 💰Аванс</pre>)\n' +
      '\n' +
      '<b>Твае катэгорыі:</b> \n' +
      '\n' +
      `<b>Даходы:</b> ${expenseCategoriesString}\n` +
      '\n' +
      `<b>Выдаткі:</b> ${incomeCategoriesString}`
  }
}

export const SCENES = {
  CATEGORIES: 'CATEGORIES'
}
