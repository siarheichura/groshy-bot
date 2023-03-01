import { Scenes } from 'telegraf'
import { SCENES } from '../constants/bot.constants.js'
import {
  enterSceneHandler,
  categoryButtonClickHandler,
  cancelOperationHandler
} from '../controllers/operation.controller.js'

export const operationScene = new Scenes.BaseScene(SCENES.OPERATION)

const includesCategoryRegExp = new RegExp('^category')

operationScene.enter(enterSceneHandler)
operationScene.action(includesCategoryRegExp, categoryButtonClickHandler)
operationScene.action('DeleteLast', cancelOperationHandler)
