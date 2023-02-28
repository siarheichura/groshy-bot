import { AdminGoogleDoc } from '../../../app.js'
import { BOT_COMMANDS, SCENES } from '../../constants.js'
import { UserDoc } from '../../models/UserDoc.js'

export const authMiddleware = async (ctx, next) => {
  console.log('CTX SESSION START: ', ctx.session)
  if (ctx.session.user) {
    return next()
  }
  const { id: chatId, username, first_name: firstName, last_name: lastName } = ctx.chat
  const { text } = ctx.message

  const user = await AdminGoogleDoc.getUser(chatId)
  if (user) {
    const UserGoogleDoc = new UserDoc(user.spreadsheetId)
    await UserGoogleDoc.start()
    ctx.session.user = { chatId, username, firstName, lastName, doc: UserGoogleDoc }
    return next()
  } else if (!user && text !== BOT_COMMANDS.START) {
    return ctx.reply('Калі ласка, спачатку выканайце каманду /start 🏁')
  } else if (!user && text === BOT_COMMANDS.START) {
    return ctx.scene.enter(SCENES.REGISTRATION)
  } else {
    return next()
  }
}
