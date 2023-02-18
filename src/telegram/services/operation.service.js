const { OPERATION_TYPES } = require('../../constants')

const getOperationDataFromMessage = async (message, wallets) => {
  let splitMessage = message.split(' ')

  // if message doesn't have sum --> reply with error
  const sum = +splitMessage.find(i => !isNaN(+i))
  if (!sum) return

  // check if message starts with wallet name
  const isStatedWithWalletName = isNaN(+splitMessage[0]) && !isNaN(+splitMessage[1])

  const wallet = isStatedWithWalletName
    ? wallets.find(wallet => wallet.name.toLowerCase() === splitMessage[0].toLowerCase() || wallet.tags.includes(splitMessage[0].toLowerCase())).name
    : wallets.find(wallet => wallet.isMain).name
  if (!wallet) return

  // check is income or expense
  const type = isStatedWithWalletName ? checkIsIncome(splitMessage[1]) : checkIsIncome(splitMessage[0])

  if (isStatedWithWalletName) {
    splitMessage.splice(0, 1)
  }

  const comment = splitMessage.filter(i => +i !== sum).join(' ')

  return { sum, comment, type, wallet }
}

const checkIsIncome = (message) => {
  return message[0] === '+'
    ? OPERATION_TYPES.INCOMES
    : OPERATION_TYPES.EXPENSES
}

const getCategoriesButtons = (categories) => {
  const buttons = categories.map(category => {
    return [{ text: category, callback_data: `category ${category}` }]
  })
  buttons.push([{ text: '🚫 Адмяніць', callback_data: 'Cancel' }])
  return buttons

  // For two columns buttons (issue with odd operation length)
  // const result = []
  // for (let i = 0; i < categories.length - 1; i += 2) {
  //   result.push(
  //     [
  //       { text: categories[i], callback_data: `category ${categories[i]}` },
  //       { text: categories[i + 1], callback_data: `category ${categories[i + 1]}` }
  //     ]
  //   )
  // }
  // result.push([{ text: '🚫 Адмяніць', callback_data: 'Cancel' }])
  // return result
}

const getAddOperationReplyMessage = (operation, wallets) => {
  let balanceString = ''
  wallets.forEach(wallet => {
    balanceString += `<b>${wallet.name}:</b> <pre>${wallet.balance} ${wallet.currency}</pre>\n`
  })

  const operationCurrency = wallets.find(wallet => wallet.name === operation.wallet).currency
  return `` +
    `<code>----------------------------------</code>\n` +
    `<b>Дададзены новы ${operation.type ? 'даход ⬅️' : 'выдатак ➡️'}:</b>\n` +
    `<b>📝Катэгорыя:</b> <pre>${operation.category}</pre>\n` +
    `<b>💵Сума:</b> <pre>${operation.sum} ${operationCurrency}</pre>\n` +
    `<b>💬Каментар:</b> <pre>${operation.comment || ' '}</pre>\n` +
    `<code>----------------------------------</code>\n` +
    `<b>⚖️ МОЙ БАЛАНС:</b>\n` +
    `${balanceString}` +
    `<code>----------------------------------</code>\n`
}

module.exports = {
  getOperationDataFromMessage,
  getCategoriesButtons,
  getAddOperationReplyMessage
}
