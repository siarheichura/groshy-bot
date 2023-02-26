import { GoogleSheetsDoc } from './GoogleSheetsDoc.js'
import { Wallet } from './Wallet.js'
import { DATE_FORMAT } from '../constants.js'
import { Category } from './Category.js'
import dayjs from 'dayjs'

const SHEET_TITLES = {
  EXPENSES: 'Выдаткі',
  INCOMES: 'Даходы',
  CATEGORIES: 'Катэгорыі',
  WALLETS: 'Рахункі'
}

const WALLETS_SHEET_HEADERS = {
  NAME: 'Назва',
  IS_MAIN: 'Галоўны',
  CURRENCY: 'Валюта',
  BALANCE: 'Баланс',
  INIT_BALANCE: 'Пачатковае значэнне',
  ALL_EXPENSES_SUM: 'Даходы за ўвесь час',
  ALL_INCOMES_SUM: 'Выдаткі за ўвесь час'
}

const CATEGORIES_SHEET_HEADERS = {
  NAME: 'Назва',
  TYPE: 'Тып'
}

const OPERATIONS_SHEET_HEADERS = {
  DATE: 'Дата',
  CATEGORY: 'Катэгорыя',
  SUM: 'Сума',
  WALLET: 'Рахунак',
  COMMENT: 'Каментар'
}

export class UserDoc extends GoogleSheetsDoc {
  constructor(id) {
    super(id)
  }

  get walletSheet() {
    return this.getSheetByTitle(SHEET_TITLES.WALLETS)
  }

  get categoriesSheet() {
    return this.getSheetByTitle(SHEET_TITLES.CATEGORIES)
  }

  get expensesSheet() {
    return this.getSheetByTitle(SHEET_TITLES.EXPENSES)
  }

  get incomesSheet() {
    return this.getSheetByTitle(SHEET_TITLES.INCOMES)
  }

  copySheets = async (sheets) => {
    await Promise.all(
      sheets.map(async sheet => await this.copySheet(sheet, this.spreadsheetId))
    )
  }

  getWallets = async () => {
    const rows = await this.walletSheet.getRows()
    return rows.map(row =>
      new Wallet(
        row[WALLETS_SHEET_HEADERS.NAME],
        !!+row[WALLETS_SHEET_HEADERS.IS_MAIN],
        row[WALLETS_SHEET_HEADERS.CURRENCY],
        row[WALLETS_SHEET_HEADERS.BALANCE]
      ))
  }

  getMainWallet = async () => {
    const wallets = await this.getWallets()
    return wallets.find(wallet => wallet.isMain)
  }

  getCategories = async (type) => {
    const rows = await this.categoriesSheet.getRows()
    const filteredByTypeRows = rows.filter(row => +row[CATEGORIES_SHEET_HEADERS.TYPE] === +type)

    return filteredByTypeRows.map(row =>
      new Category(
        row[CATEGORIES_SHEET_HEADERS.NAME],
        row[CATEGORIES_SHEET_HEADERS.TYPE]
      ))
  }

  addOperation = async (operation) => {
    const sheet = operation.type ? this.incomesSheet : this.expensesSheet
    // Дата, Катэгорыя, Сума, Рахунак, Каментар
    await sheet.addRow([
      dayjs().format(DATE_FORMAT),
      operation.category,
      operation.sum.replace('.', ','),
      operation.wallet,
      operation.comment
    ])
  }

  deleteLastOperation = async (type) => {
    const sheet = type ? this.incomesSheet : this.expensesSheet
    const rows = await sheet.getRows()
    const lastRowIndex = rows[rows.length - 1].rowIndex
    await sheet.clearRows({ start: lastRowIndex, end: lastRowIndex })
  }

  getReportByCategories = async (type, period) => {
    const sheet = type ? this.incomesSheet : this.expensesSheet

    const rows = await sheet.getRows()

    const operationsByPeriod = rows.filter(row =>
      dayjs(row[OPERATIONS_SHEET_HEADERS.DATE], DATE_FORMAT).isSame(dayjs(period, DATE_FORMAT), 'month')
    )


    const result = [] // {category: string, sum: number}
    operationsByPeriod.forEach(operation => {
      const index = result.map(r => r.category).indexOf(operation[OPERATIONS_SHEET_HEADERS.CATEGORY])
      const operationSum = +operation[OPERATIONS_SHEET_HEADERS.SUM].replace(/,/g, '.')

      if (index >= 0) {
        result[index].sum = +result[index].sum + operationSum
      } else {
        result.push({ category: operation[OPERATIONS_SHEET_HEADERS.CATEGORY], sum: operationSum })
      }
    })

    return result
      .map(r => ({ ...r, sum: r.sum.toFixed(2) }))
      .sort((a, b) => b.sum - a.sum)
  }
}
