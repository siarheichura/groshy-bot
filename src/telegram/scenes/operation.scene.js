import { Scenes } from 'telegraf'
import { SCENES } from '../../constants.js'
import {
  enterSceneHandler,
  categoryButtonClickHandler,
  cancelOperationHandler
} from '../controllers/operation.controller.js'

export const operationScene = new Scenes.BaseScene(SCENES.OPERATION)

const includesCategoryRegExp = new RegExp('^category')

operationScene.enter(async ctx => await enterSceneHandler(ctx))
operationScene.action(includesCategoryRegExp, async ctx => await categoryButtonClickHandler(ctx))
operationScene.action('DeleteLast', async ctx => await cancelOperationHandler(ctx))
