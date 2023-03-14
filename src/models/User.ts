import { Aggregate, model, Schema } from 'mongoose'
import { ICategory, IUser, IWallet, OperationType } from '../interfaces'

const walletSchema = new Schema<IWallet>({
  balance: { type: Number, required: true, default: 0 },
  currency: { type: String }
})

const userSchema = new Schema<IUser>({
  chatId: { type: String, required: true },
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  wallet: { type: walletSchema, required: true, default: { balance: 0, currency: '' } },
  stash: { type: walletSchema, required: true, default: { balance: 0, currency: '' } },
  categories: {
    expense: [{ type: String }],
    income: [{ type: String }]
  }
}, {
  timestamps: true
})

export const UserModel = model('User', userSchema)

export const addCategory = async (chatId: number, name: string, type: OperationType) => {
  if (type === 'expense') {
    await UserModel.findOneAndUpdate({ chatId }, { $addToSet: { 'categories.expense': name } })
  } else if (type === 'income') {
    await UserModel.findOneAndUpdate({ chatId }, { $addToSet: { 'categories.income': name } })
  }
}

export const deleteCategory = async (chatId: number, name: string, type: OperationType) => {
  if (type === 'expense') {
    await UserModel.findOneAndUpdate({ chatId }, { $pull: { 'categories.expense': name } })
  } else if (type === 'income') {
    await UserModel.findOneAndUpdate({ chatId }, { $pull: { 'categories.income': name } })
  }
}

export const getAllCategories = async (chatId: number): Promise<Aggregate<{ expense: string[], income: string[] }>> => {
  const result = await UserModel.aggregate([
    { $match: { chatId: chatId.toString() } },
    { $project: { _id: 0, categories: 1 } }
  ])
  return result[0].categories
}
