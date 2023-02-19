import { Scenes } from 'telegraf'
import { SCENES } from '../../constants.js'
import { enterSceneHandler } from '../controllers/reports.controller.js'

export const reportsScene = new Scenes.BaseScene(SCENES.REPORTS)

reportsScene.enter(async ctx => await enterSceneHandler(ctx))
