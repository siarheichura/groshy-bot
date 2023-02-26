import { Scenes } from 'telegraf'
import { SCENES } from '../../constants.js'
import {
  enterSceneHandler,
  hearsAnyTextHandler,
  hearsGmailHandler,
  leaveSceneHandler
} from '../controllers/registration.controller.js'

export const registrationScene = new Scenes.BaseScene(SCENES.REGISTRATION)

const gmailRegExp = new RegExp('[a-zA-Z0-9]+\@gmail.com')

registrationScene.enter(async ctx => await enterSceneHandler(ctx))
registrationScene.hears(gmailRegExp, async ctx => hearsGmailHandler(ctx))
registrationScene.hears(/.+/, async ctx => await hearsAnyTextHandler(ctx))
registrationScene.leave(async () => await leaveSceneHandler())
