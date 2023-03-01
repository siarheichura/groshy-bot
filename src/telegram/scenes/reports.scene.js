import { Scenes } from 'telegraf'
import { enterSceneHandler } from '../controllers/reports.controller.js'
import { SCENES } from '../constants/bot.constants.js'

export const reportsScene = new Scenes.BaseScene(SCENES.REPORTS)

reportsScene.enter(enterSceneHandler)
