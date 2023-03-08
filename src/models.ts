import { Aggregate, model, Schema, Types } from 'mongoose'
import { Dayjs } from 'dayjs'
import { ICategory, IOperation, IReport, IUser, IWallet, OperationType } from './interfaces'

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

export const getReportByCategories = async (
  userId: Types.ObjectId,
  type: OperationType,
  period: { start: Dayjs, end: Dayjs }
): Promise<Aggregate<IReport> | undefined> => {
  const report = await OperationModel.aggregate([
    { $match: { user: userId, type, createdAt: { $gte: period.start.toDate(), $lte: period.end.toDate() } } },
    { $group: { _id: '$category', sum: { $sum: '$sum' } } },
    { $project: { _id: 0, category: '$_id', sum: { $sum: '$sum' } } },
    { $sort: { sum: -1 } },
    { $group: { _id: null, data: { $push: '$$ROOT' }, total: { $sum: '$sum' } } },
    { $project: { _id: 0, data: '$data', total: '$total' } }
  ])
  return report[0]
}
