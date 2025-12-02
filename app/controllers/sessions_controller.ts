import { HttpContext } from '@adonisjs/core/http'
import Account from '../models/account.js'
import { createSessionValidator } from '../validators/account.js'

export default class SessionsController {
  async create({ request, response }: HttpContext) {
    const data = request.all()
    const { email, password } = await createSessionValidator.validate(data)

    const account = await Account.verifyCredentials(email, password)
    const token = await Account.accessTokens.create(account)
    return response.created(token)
  }
}
