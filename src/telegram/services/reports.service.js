export const getReportByCategoriesReplyMessage = (data, type, date, totalSum) => {
  let string = ''

  data.forEach(item => string += `<pre>${item.category}: ${item.sum}</pre>\n`)

  return `` +
    `<pre>------------------------------</pre>\n` +
    `<b>${type ? 'Даходы' : 'Выдаткі'} за ${date.format('MM.YYYY')}</b>\n` +
    `<pre>------------------------------</pre>\n` +
    `${string}` +
    `<pre>------------------------------</pre>\n` +
    `<b>Агульная сума: ${totalSum}</b>\n` +
    `<pre>------------------------------</pre>`
}
