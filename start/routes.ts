/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const AccountsController = () => import('../app/controllers/accounts_controller.js')
const SessionsController = () => import('../app/controllers/sessions_controller.js')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/accounts', [AccountsController, 'create'])
router.post('/sessions', [SessionsController, 'create'])
