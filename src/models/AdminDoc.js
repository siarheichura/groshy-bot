import { GoogleSheetsDoc } from './GoogleSheetsDoc.js'
import { User } from './User.js'

const SHEETS_TITLES = {
  USERS: 'Users',
  EXPENSES: 'Выдаткі',
  INCOMES: 'Даходы',
  CATEGORIES: 'Катэгорыі',
  WALLETS: 'Рахункі'
}

export class AdminDoc extends GoogleSheetsDoc {
  constructor(id) {
    super(id)
  }

  get usersSheet() {
    return this.getSheetByTitle(SHEETS_TITLES.USERS)
  }

  getUsers = async () => {
    const rows = await this.usersSheet.getRows()
    return rows.map(row =>
      new User(
        row.chatId,
        row.username,
        row.firstName,
        row.lastName,
        row.email,
        row.registrationDate,
        row.spreadsheetId,
        row.deletedAt
      )
    )
  }

  getUser = async (chatId) => {
    const users = await this.getUsers()
    return users.find(user => +user.chatId === +chatId)
  }

  addUser = async (user) => {
    await this.usersSheet.addRow(user)
  }
}
