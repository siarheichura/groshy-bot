import { model, Schema } from 'mongoose'
import { ICategory, IOperation, IUser, IWallet } from './interfaces'

const walletSchema = new Schema<IWallet>({
  balance: { type: Number, required: true, default: 0 },
  currency: { type: String }
})
const categorySchema = new Schema<ICategory>({
  type: { type: String, required: true },
  name: { type: String, required: true }
})
const operationSchema = new Schema<IOperation>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  category: { type: String, required: true },
  sum: { type: Number, required: true },
  comment: { type: String }
}, { timestamps: true })

const userSchema = new Schema<IUser>({
  chatId: { type: String, required: true },
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  wallet: { type: walletSchema, required: true, default: { balance: 0, currency: '' } },
  stash: { type: walletSchema, required: true, default: { balance: 0, currency: '' } },
  categories: [categorySchema]
}, {
  timestamps: true
})

export const UserModel = model('User', userSchema)
export const OperationModel = model('Operation', operationSchema)
