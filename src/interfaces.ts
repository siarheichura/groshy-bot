import { Types } from 'mongoose'
import { Context, Scenes } from 'telegraf'
import { Dayjs } from 'dayjs'

interface ISessionData {
  categoriesToDelete?: any[]
  categories?: any[]
  operation?: {
    type: string,
    sum: number,
    comment: string,
    user: string
  },
  updBalance?: number
}

export interface IContext extends Context {
  session: ISessionData;
}

export interface IUser {
  chatId: string
  username: string
  firstName: string
  lastName: string
  wallet: IWallet
  stash: IWallet
  // categories: ICategory[]
  categories: {
    expense: string[]
    income: string[]
  }
}

export interface IWallet {
  balance: number
  currency: string
}

export interface ICategory {
  _id: Types.ObjectId
  type: OperationType
  name: string
}

export interface IOperation {
  user: Types.ObjectId
  type: OperationType
  category: string // or make it objectId ???
  sum: number
  comment: string
}

export type OperationType = 'income' | 'expense'

export interface IReportItem {
  category: string
  sum: number
}

export interface IReport {
  data: IReportItem[]
  total: number
}

export interface IReportDates {
  prev: Dayjs
  next: Dayjs
  curr: Dayjs
  period: {
    start: Dayjs
    end: Dayjs
  }
}

export interface IInlineKeyboard {
  text: string
  callback_data: string
}
