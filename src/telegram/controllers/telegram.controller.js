import { Markup } from 'telegraf'
import { MESSAGES } from '../constants/messages.contants.js'
import { SCENES, REPLY_KEYBOARD } from '../constants/bot.constants.js'

export const startCommandHandler = async (ctx) => {
  const { doc } = ctx.session.user

  await ctx.telegram.setMyCommands([
    { command: 'start', description: 'My GoogleSheet' }
  ])

  return ctx.reply(
    MESSAGES.YOUR_TABLE_LINK(doc.link),
    Markup.keyboard(REPLY_KEYBOARD).resize()
  )
}

export const hearsBalanceHandler = async ctx => {
  const { doc } = ctx.session.user
  const wallets = await doc.getWallets()

  let string = ''
  wallets.forEach(wallet => {
    string += `<b>${wallet.name}:</b> <pre>${wallet.balance} ${wallet.currency}</pre>\n`
  })

  const replyMessage = `` +
    `<code>------------------------------</code>\n` +
    `<b>⚖️Мой баланс:</b>\n` +
    `${string}` +
    `<code>------------------------------</code>\n`

  return ctx.replyWithHTML(replyMessage)
}

export const hearsReportNameHandler = ctx => ctx.scene.enter(SCENES.REPORTS)

export const hearsAnything = ctx => ctx.reply(MESSAGES.NO_SUM)

export const onTextHandler = (ctx) => ctx.scene.enter(SCENES.OPERATION)
