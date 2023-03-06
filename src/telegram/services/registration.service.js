// import { AdminGoogleDoc } from '../../../app.js'
// import { INITIAL_WALLETS_ROW, USER_SHEETS_TITLES } from '../constants/sheets.constants.js'
//
// export const copySheetsFromAdminDoc = async (userDoc) => {
//   const expensesSheetTemplate = AdminGoogleDoc.getSheetByTitle(USER_SHEETS_TITLES.EXPENSES)
//   await AdminGoogleDoc.copySheet(expensesSheetTemplate, userDoc.spreadsheetId)
//   const incomesSheetTemplate = AdminGoogleDoc.getSheetByTitle(USER_SHEETS_TITLES.INCOMES)
//   await AdminGoogleDoc.copySheet(incomesSheetTemplate, userDoc.spreadsheetId)
//   const categoriesSheetTemplate = AdminGoogleDoc.getSheetByTitle(USER_SHEETS_TITLES.CATEGORIES)
//   await AdminGoogleDoc.copySheet(categoriesSheetTemplate, userDoc.spreadsheetId)
//   const walletsSheetTemplate = AdminGoogleDoc.getSheetByTitle(USER_SHEETS_TITLES.WALLETS)
//   await AdminGoogleDoc.copySheet(walletsSheetTemplate, userDoc.spreadsheetId)
//   await userDoc.getSheetByIndex(0).delete()
// }
//
// export const updateUserSheetsTitles = async (userDoc) => {
//   await userDoc.getSheetByTitle('Copy of Выдаткі').updateProperties({ title: USER_SHEETS_TITLES.EXPENSES })
//   await userDoc.getSheetByTitle('Copy of Даходы').updateProperties({ title: USER_SHEETS_TITLES.INCOMES })
//   await userDoc.getSheetByTitle('Copy of Катэгорыі').updateProperties({ title: USER_SHEETS_TITLES.CATEGORIES })
//   await userDoc.getSheetByTitle('Copy of Рахункі').updateProperties({ title: USER_SHEETS_TITLES.WALLETS })
// }
//
// export const addInitWallet = async (userDoc) => {
//   const walletsSheet = userDoc.getSheetByTitle(USER_SHEETS_TITLES.WALLETS)
//   await walletsSheet.addRow(INITIAL_WALLETS_ROW)
// }
//
