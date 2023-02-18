const { Scenes, Markup } = require('telegraf')
const { SCENES } = require('../../constants')
const { getReportByCategories } = require('../../google-spreadsheet/google-spreadsheet')
const dayjs = require('dayjs')

const reportsScene = new Scenes.BaseScene(SCENES.REPORTS)

reportsScene.enter(async ctx => {
  const match = ctx.match.input.toLowerCase()
  // remove string
  const isExpense = match.includes('выдаткі')
  const currDate = dayjs()

  const result = await getReportByCategories(isExpense)
  const totalSum = result.reduce((curr, prev) => curr + +prev.sum, 0)

  let string = ''
  result.forEach(i => {
    string += `<pre>${i.category}: ${i.sum}</pre>\n`
  })
  let replyMessage = `` +
    `<b>${isExpense ? 'Выдаткі' : 'Даходы'} за ${currDate.format('MM.YYYY')}</b>\n` +
    `<pre>----------------------------------</pre>\n` +
    `${string}` +
    `<pre>----------------------------------</pre>\n` +
    `<b>Агульная сума: ${totalSum}</b>`

  const keyboard = [
    { text: '<<<', callback_data: 'previous' },
    { text: '>>>', callback_data: 'next' },
  ]
  return ctx.replyWithHTML(
    replyMessage,
    Markup.inlineKeyboard(keyboard, {columns: 2}).resize()
  )
})

module.exports = {
  reportsScene
}
