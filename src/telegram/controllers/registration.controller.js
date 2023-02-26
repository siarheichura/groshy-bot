import { AdminGoogleDoc } from '../../../app.js'
import dayjs from 'dayjs'
import { DATE_FORMAT } from '../../constants.js'
import { UserDoc } from '../../models/UserDoc.js'

const UserGoogleDoc = new UserDoc()

export const enterSceneHandler = async ctx => {
  const { username } = ctx.chat

  const message = `` +
    `Прывітанне, <b>${username}!👋</b> Вельмі рады бачыць цябе тут🤗\n` +
    `\n` +
    `Калі ласка, <b>увядзі свой паштовы адрас gmail</b> для таго, каб мы падрыхтавалі табліцу ў Google Sheets для цябе.\n` +
    `\n` +
    `Дзякуй!🤍❤️🤍`

  ctx.replyWithHTML(message)
}

export const hearsGmailHandler = async ctx => {
  ctx.reply('Адну хвілінку, падрыхтоўваю табліцу...')

  const { text: email } = ctx.message
  const { id: chatId, username, first_name: firstName, last_name: lastName } = ctx.chat

  await UserGoogleDoc.start(email)

  const expensesSheetTemplate = AdminGoogleDoc.getSheetByTitle('Выдаткі')
  await AdminGoogleDoc.copySheet(expensesSheetTemplate, UserGoogleDoc.spreadsheetId)
  const incomesSheetTemplate = AdminGoogleDoc.getSheetByTitle('Даходы')
  await AdminGoogleDoc.copySheet(incomesSheetTemplate, UserGoogleDoc.spreadsheetId)
  const categoriesSheetTemplate = AdminGoogleDoc.getSheetByTitle('Катэгорыі')
  await AdminGoogleDoc.copySheet(categoriesSheetTemplate, UserGoogleDoc.spreadsheetId)
  const walletsSheetTemplate = AdminGoogleDoc.getSheetByTitle('Рахункі')
  await AdminGoogleDoc.copySheet(walletsSheetTemplate, UserGoogleDoc.spreadsheetId)
  await UserGoogleDoc.getSheetByIndex(0).delete()

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

  ctx.reply(`Твая таблічка тут: ${UserGoogleDoc.link}`)
  return ctx.scene.leave()
}

export const hearsAnyTextHandler = async ctx => {
  return ctx.reply('👎Некарэктны адрас!')
}

export const leaveSceneHandler = async () => {
  await UserGoogleDoc.getSheetByTitle('Copy of Выдаткі').updateProperties({ title: 'Выдаткі' })
  await UserGoogleDoc.getSheetByTitle('Copy of Даходы').updateProperties({ title: 'Даходы' })
  await UserGoogleDoc.getSheetByTitle('Copy of Катэгорыі').updateProperties({ title: 'Катэгорыі' })
  await UserGoogleDoc.getSheetByTitle('Copy of Рахункі').updateProperties({ title: 'Рахункі' })

  const walletsSheet = UserGoogleDoc.getSheetByTitle('Рахункі')
  await walletsSheet.addRow([
    'Мой рахуначак',
    '1',
    'GEL',
    '=E2+F2-G2',
    '0',
    '=СУММЕСЛИ(\'Даходы\'!D2:D, A2, \'Даходы\'!C2:C)',
    '=СУММЕСЛИ(\'Выдаткі\'!D2:D, A2, \'Выдаткі\'!C2:C)'
  ])
}
