import { OPERATION_TYPES } from '../constants/shared.constants.js'

export const getOperationDataFromMessage = async (message) => {
  let [sum, ...comment] = message.split(' ')
  const type = sum[0] === '+' ? OPERATION_TYPES.INCOMES : OPERATION_TYPES.EXPENSES
  sum = +sum.replace(/,/g, '.').replace('+', '')
  if (isNaN(+sum)) return

  return { sum: sum.toFixed(2), comment: comment.join(' '), type }
}

export const getAddOperationReplyMessage = (operation, wallets) => {
  let balanceString = ''
  wallets.forEach(wallet => {
    balanceString += `<b>${wallet.name}:</b> <pre>${wallet.balance} ${wallet.currency}</pre>\n`
  })

  return `` +
    `<code>------------------------------</code>\n` +
    `<b>Дададзены новы ${operation.type ? 'даход ⬅️' : 'выдатак ➡️'}:</b>\n` +
    `<b>📝Катэгорыя:</b> <pre>${operation.category}</pre>\n` +
    `<b>💵Сума:</b> <pre>${operation.sum} ${operation.currency}</pre>\n` +
    `<b>💬Каментар:</b> <pre>${operation.comment || ' '}</pre>\n` +
    `<code>------------------------------</code>\n` +
    `<b>⚖️Мой баланс:</b>\n` +
    `${balanceString}` +
    `<code>------------------------------</code>\n`
}
