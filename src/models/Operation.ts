import { Aggregate, model, Schema, Types } from 'mongoose'
import { IOperation, IReport, OperationType } from '../interfaces'
import { Dayjs } from 'dayjs'

const operationSchema = new Schema<IOperation>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  category: { type: String, required: true },
  sum: { type: Number, required: true },
  comment: { type: String }
}, { timestamps: true })

export const OperationModel = model('Operation', operationSchema)

export const getReportByCategories = async (
  userId: Types.ObjectId,
  type: OperationType,
  period: { start: Dayjs, end: Dayjs }
): Promise<Aggregate<IReport> | undefined> => {
  const report = await OperationModel.aggregate([
    { $match: { user: userId, type, createdAt: { $gte: period.start.toDate(), $lte: period.end.toDate() } } },
    { $group: { _id: '$category', sum: { $sum: '$sum' } } },
    { $project: { _id: 0, category: '$_id', sum: { $sum: { $round: ['$sum', 2] } } } },
    { $sort: { sum: -1 } },
    { $group: { _id: null, data: { $push: '$$ROOT' }, total: { $sum: { $round: ['$sum', 2] } } } },
    { $project: { _id: 0, data: '$data', total: { $round: ['$total', 2] } } }
  ])
  return report[0]
}
