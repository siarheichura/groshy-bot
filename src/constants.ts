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
    `<code>------------------------------</code>\n`
}
