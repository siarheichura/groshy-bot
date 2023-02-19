const { Scenes } = require('telegraf')
const { SCENES } = require('../../constants')
const { enterSceneHandler } = require('../controllers/reports.controller')

const reportsScene = new Scenes.BaseScene(SCENES.REPORTS)

reportsScene.enter(async ctx => await enterSceneHandler(ctx))

module.exports = {
  reportsScene
}
