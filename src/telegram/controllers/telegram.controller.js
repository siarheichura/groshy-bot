import { SCENES } from '../../constants.js'
import { AdminGoogleDoc } from '../../../app.js'
import { UserDoc } from '../../models/UserDoc.js'

export const startCommandHandler = async (ctx) => {
  const { doc } = ctx.session.user
  const userDocLink = doc.link

  const replyMsg = `<a href='${userDocLink}'>Твая таблічка</a>📝`
  return ctx.replyWithHTML(replyMsg)
}

export const hearsBalanceHandler = async ctx => {
  const { id: chatId } = ctx.chat
  const user = await AdminGoogleDoc.getUser(chatId)
  const UserGoogleDoc = new UserDoc(user.spreadsheetId)
  await UserGoogleDoc.start()

  const wallets = await UserGoogleDoc.getWallets()

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

export const onTextHandler = (ctx) => {
  return ctx.scene.enter(SCENES.OPERATION)
}
