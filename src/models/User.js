export class User {
  constructor(
    chatId,
    username,
    firstName,
    lastName,
    email,
    registrationDate,
    spreadsheetId,
    deletedAt
  ) {
    this.chatId = chatId
    this.username = username
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.registrationDate = registrationDate
    this.spreadsheetId = spreadsheetId
    this.deletedAt = deletedAt
  }
}
