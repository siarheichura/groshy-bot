import { Markup } from 'telegraf'
import { MY_DOC_LINK, REPLY_KEYBOARD_VALUES, SCENES } from '../../constants.js'
import { getWallets } from '../../google-spreadsheet/google-spreadsheet.js'

export const startCommandHandler = async (ctx, wallets) => {
  const { balance, currency } = wallets.find(wallet => wallet.isMain)

  await ctx.telegram.setMyCommands([
    { command: 'start', description: 'start command' }
  ])

  const keyboard = REPLY_KEYBOARD_VALUES(`${balance}${currency}`)
  const replyMessage = `<a href='${MY_DOC_LINK}'>Твая таблічка</a>📝`

  return ctx.replyWithHTML(
    replyMessage,
    Markup.keyboard(keyboard, { columns: 2 }).resize()
  )
}

export const hearsBalanceHandler = async ctx => {
  const wallets = await getWallets()

  let string = ''
  wallets.forEach(wallet => {
    string += `<b>${wallet.name}:</b> <pre>${wallet.balance} ${wallet.currency}</pre>\n`
  })

  const replyMessage = `` +
    `<code>----------------------------------</code>\n` +
    `<b>⚖️Мой баланс:</b>\n` +
    `<code>----------------------------------</code>\n` +
    `${string}` +
    `<code>----------------------------------</code>\n`

  return ctx.replyWithHTML(replyMessage)
}

export const hearsReportNameHandler = ctx => ctx.scene.enter(SCENES.REPORTS)

export const onTextHandler = (ctx, initialState) => {
  const { wallets, categories } = initialState

  ctx.session.wallets = wallets
  ctx.session.categories = {
    expense: categories.filter(category => !category.type).map(category => category.name),
    income: categories.filter(category => category.type).map(category => category.name)
  }

  return ctx.scene.enter(SCENES.OPERATION)
}
