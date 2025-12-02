import { HttpContext } from '@adonisjs/core/http'
import { createPostValidator } from '../validators/account.js'
import Account from '../models/account.js'

export default class AccountsController {
  async create({ request, response }: HttpContext) {
    const data = request.all()
    const { email, password, name } = await createPostValidator.validate(data)

    const createdAccount = await Account.create({ email, password, name })
    const token = await Account.accessTokens.create(createdAccount)
    return response.created(token)
  }
}
