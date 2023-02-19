const { GoogleSpreadsheet } = require('google-spreadsheet')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
const { CONFIG } = require('../config')
const { DATE_FORMAT, SHEETS } = require('../constants')

const doc = new GoogleSpreadsheet(CONFIG.GOOGLE_SPREADSHEET_ID)

const startSpreadsheet = async () => {
  await doc.useServiceAccountAuth({
    client_email: CONFIG.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: CONFIG.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
  await doc.loadInfo()
}

const getSheetByIndex = (index) => doc.sheetsByIndex[index]

const getAllCategories = async () => {
  const categoriesSheet = getSheetByIndex(SHEETS.CATEGORIES)
  await categoriesSheet.loadHeaderRow(2)
  const [name, type] = categoriesSheet.headerValues
  const rows = await categoriesSheet.getRows()
  return rows.map(r => ({ name: r[name], type: +r[type] }))
}

const getWallets = async () => {
  const walletsSheet = getSheetByIndex(SHEETS.WALLETS)
  await walletsSheet.loadHeaderRow()
  const [name, isMain, tags, currency, balance] = walletsSheet.headerValues
  const rows = await walletsSheet.getRows()

  return rows.map(row => {
    return {
      name: row[name],
      isMain: !!+row[isMain],
      tags: row[tags].split(',').map((i) => i.trim().toLowerCase()),
      currency: row[currency],
      balance: row[balance]
    }
  })
}

const addOperation = async (operation) => {
  const sheet = operation.type ? getSheetByIndex(SHEETS.INCOMES) : getSheetByIndex(SHEETS.EXPENSES)
  await sheet.loadHeaderRow()
  const [date, category, sum, wallet, comment] = sheet.headerValues

  const operationToAdd = {}
  operationToAdd[date] = dayjs().format(DATE_FORMAT)
  operationToAdd[category] = operation.category
  operationToAdd[sum] = operation.sum
  operationToAdd[wallet] = operation.wallet
  operationToAdd[comment] = operation.comment

  await sheet.addRow(operationToAdd)
}

const deleteLastOperation = async (type) => {
  const sheet = type ? getSheetByIndex(SHEETS.INCOMES) : getSheetByIndex(SHEETS.EXPENSES)
  const rows = await sheet.getRows()
  const lastRowIndex = rows[rows.length - 1].rowIndex
  await sheet.clearRows({ start: lastRowIndex, end: lastRowIndex })
}

const getReportByCategories = async (isExpense, period) => {
  const sheet = isExpense ? getSheetByIndex(SHEETS.EXPENSES) : getSheetByIndex(SHEETS.INCOMES)
  await sheet.loadHeaderRow()
  const [date, category, sum] = sheet.headerValues

  const rows = await sheet.getRows()

  const operationsByPeriod = rows.filter(row =>
    dayjs(row[date], DATE_FORMAT).isSame(dayjs(period, DATE_FORMAT), 'month')
  )

  const result = [] // {category: string, sum: number}

  operationsByPeriod.forEach(operation => {
    const index = result.map(r => r.category).indexOf(operation[category])
    const operationSum = +operation[sum].replace(/,/g, '.')

    if (index >= 0) {
      result[index].sum = +result[index].sum + operationSum
    } else {
      result.push({ category: operation[category], sum: operationSum })
    }
  })

  return result.sort((a, b) => b.sum - a.sum)
}

module.exports = {
  startSpreadsheet,
  getSheetByIndex,
  addOperation,
  deleteLastOperation,
  getWallets,
  getAllCategories,
  getReportByCategories
}