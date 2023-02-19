const getReportByCategoriesReplyMessage = (data, isExpense, date, totalSum) => {
  let string = ''

  data.forEach(item => string += `<pre>${item.category}: ${item.sum}</pre>\n`)

  return `` +
    `<pre>----------------------------------</pre>\n` +
    `<b>${isExpense ? 'Выдаткі' : 'Даходы'} за ${date.format('MM.YYYY')}</b>\n` +
    `<pre>----------------------------------</pre>\n` +
    `${string}` +
    `<pre>----------------------------------</pre>\n` +
    `<b>Агульная сума: ${totalSum}</b>\n` +
    `<pre>----------------------------------</pre>`
}

module.exports = {
  getReportByCategoriesReplyMessage
}
