import { GoogleSpreadsheet } from 'google-spreadsheet'
import { CONFIG } from '../config.js'
import { google } from 'googleapis'

const USER_DOC_TITLE = 'HrošyBot'

export class GoogleSheetsDoc {
  doc

  constructor(id) {
    this.doc = id ? new GoogleSpreadsheet(id) : new GoogleSpreadsheet()
  }

  get spreadsheetId() {
    return this.doc.spreadsheetId
  }

  get link() {
    return `https://docs.google.com/spreadsheets/d/${this.spreadsheetId}/edit#gid=0`
  }

  auth = async () => {
    await this.doc.useServiceAccountAuth(CONFIG.GOOGLE_CREDS)
  }

  start = async (email) => {
    await this.auth()

    if (!this.spreadsheetId && email) {
      await this.createDoc()
      await this.givePermissions(email)
    }

    await this.doc.loadInfo()
  }

  createDoc = async () => {
    await this.doc.createNewSpreadsheetDocument({ title: USER_DOC_TITLE })
  }

  givePermissions = async (email) => {
    const scopes = ['https://www.googleapis.com/auth/drive']
    const auth = new google.auth.JWT(
      CONFIG.GOOGLE_SERVICE_ACCOUNT_EMAIL, null,
      CONFIG.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), scopes
    )

    const drive = await google.drive({ version: 'v3', auth })
    await drive.permissions.create({
      resource: {
        type: 'user',
        role: 'writer',
        emailAddress: email
      },
      fileId: this.spreadsheetId,
      fields: 'id'
    })
  }

  getSheetByIndex = (index) => {
    return this.doc.sheetsByIndex[index]
  }

  getSheetByTitle = (title) => {
    return this.doc.sheetsByTitle[title]
  }

  copySheet = async (sheet, toSpreadsheetId) => {
    await sheet.copyToSpreadsheet(toSpreadsheetId)
  }
}
