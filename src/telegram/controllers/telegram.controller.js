import { Markup } from 'telegraf'
import { REPLY_KEYBOARD_VALUES, MY_DOC_LINK, SCENES } from '../../constants.js'

export const startCommandHandler = async ctx => {
  await ctx.telegram.setMyCommands([
    { command: 'start', description: 'start command' }
  ])

  const keyboard = REPLY_KEYBOARD_VALUES.map(i => ({ text: i }))
  const replyMessage = `<a href='${MY_DOC_LINK}'>Твая таблічка</a>📝`

  return ctx.replyWithHTML(
    replyMessage,
    Markup.keyboard(keyboard, { columns: 2 }).resize()
  )
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
