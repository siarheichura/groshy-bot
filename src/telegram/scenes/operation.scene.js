const { Scenes } = require('telegraf')
const { SCENES } = require('../../constants')
const {
  enterSceneHandler,
  categoryButtonClickHandler,
  cancelOperationHandler
} = require('../controllers/operation.controller')

const operationScene = new Scenes.BaseScene(SCENES.OPERATION)

const includesCategoryRegExp = new RegExp('^category')

operationScene.enter(async ctx => await enterSceneHandler(ctx))
operationScene.action(includesCategoryRegExp, async ctx => await categoryButtonClickHandler(ctx))
operationScene.action('DeleteLast', async ctx => await cancelOperationHandler(ctx))

module.exports = {
  operationScene
}
