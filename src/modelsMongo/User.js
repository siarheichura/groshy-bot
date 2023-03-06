import { model, Schema } from 'mongoose'

const walletSchema = new Schema({
  balance: { type: Number, required: true, default: 0 },
  currency: { type: String }
})
const categorySchema = new Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
})
const operationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  category: { type: String, required: true },
  sum: { type: Number, required: true },
  comment: { type: String }
}, { timestamps: true })

const initWallet = {
  balance: 0,
  currency: ''
}

const userSchema = new Schema({
  chatId: { type: String, required: true },
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  wallet: { type: walletSchema, required: true, default: initWallet },
  stash: { type: walletSchema, required: true, default: initWallet },
  categories: [categorySchema],
  // deletedAt: { type: Date, default: null }
}, {
  timestamps: true
})

export const UserModel = model('User', userSchema)
export const OperationModel = model('Operation', operationSchema)
