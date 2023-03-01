import dayjs from 'dayjs'
import { AdminGoogleDoc } from '../../../app.js'
import { UserDoc } from '../../models/UserDoc.js'
import { addInitWallet, copySheetsFromAdminDoc, updateUserSheetsTitles } from '../services/registration.service.js'
import { MESSAGES } from '../constants/messages.contants.js'
import { REGEXPS } from '../constants/regexps.constants.js'
import { DATE_FORMAT } from '../constants/shared.constants.js'

export const greetingStepHandler = ctx => {
  ctx.replyWithHTML(MESSAGES.GREETING(ctx.chat.username))
  return ctx.wizard.next()
}

export const gmailStepHandler = async (ctx) => {
  if (!REGEXPS.GMAIL.test(ctx.message.text)) {
    return ctx.reply(MESSAGES.WRONG_EMAIL)
  }

  ctx.reply(MESSAGES.PREPARING_TABLE)

  const { text: email } = ctx.message
  const { id: chatId, username, first_name: firstName, last_name: lastName } = ctx.chat

  const UserGoogleDoc = new UserDoc()
  await UserGoogleDoc.start(email)
  await copySheetsFromAdminDoc(UserGoogleDoc)
  await updateUserSheetsTitles(UserGoogleDoc)
  await addInitWallet(UserGoogleDoc)

  await AdminGoogleDoc.addUser({
    chatId,
    username,
    firstName,
    lastName,
    email,
    registrationDate: dayjs().format(DATE_FORMAT),
    spreadsheetId: UserGoogleDoc.spreadsheetId,
    deletedAt: null
  })

  ctx.session.user = { chatId, username, firstName, lastName, doc: UserGoogleDoc }
  ctx.reply(MESSAGES.YOUR_TABLE_LINK(UserGoogleDoc.link))
  return ctx.scene.leave()
}
