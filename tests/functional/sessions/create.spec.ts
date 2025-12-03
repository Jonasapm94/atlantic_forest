import { test } from '@japa/runner'
import Account from '../../../app/models/account.js'
import { faker } from '@faker-js/faker'

test.group('create session when account exists', () => {
  test('returns status 201 with account token', async ({ expect, client }) => {
    const name = faker.person.fullName()
    const password = faker.internet.password()
    const email = faker.internet.email()
    await Account.create({ name, email, password })

    const response = await client.post('/sessions').json({
      email,
      password,
    })

    expect(response.status()).toBe(201)
    expect(response.body()).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        type: expect.any(String),
        abilities: ['*'],
      })
    )
    expect(response.body()).not.toHaveProperty('password')
  })
})

test.group('create session when account does not exist', () => {
  test('returns status 400', async ({ expect, client }) => {
    const email = faker.internet.email()
    const password = faker.internet.password()

    const response = await client.post('/sessions').json({
      email,
      password,
    })

    expect(response.status()).toBe(400)
  })
})

test.group('create session with invalid data', () => {
  test('returns status 422 with missing email', async ({ expect, client }) => {
    const password = faker.internet.password()

    const response = await client.post('/sessions').json({
      password,
    })

    expect(response.status()).toBe(422)
  })

  test('returns status 422 with missing password', async ({ expect, client }) => {
    const email = faker.internet.email()

    const response = await client.post('/sessions').json({
      email,
    })

    expect(response.status()).toBe(422)
  })
})
