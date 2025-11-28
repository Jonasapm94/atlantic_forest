import { test } from '@japa/runner'
import Account from '../../../app/models/account.js'
import { faker } from '@faker-js/faker'

test.group('Accounts create (http request)', () => {
  test('returns status 201 with account token', async ({ expect, client }) => {
    const name = faker.person.fullName()
    const password = faker.internet.password()
    const email = faker.internet.email()
    const response = await client.post('/accounts').json({
      name,
      password,
      email,
    })

    console.log(response.body())

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

  test('returns status 422 when email has already been taken', async ({ expect, client }) => {
    const name = faker.person.fullName()
    const password = faker.internet.password()
    const email = faker.internet.email()
    await Account.create({ name, email, password })

    const response = await client.post('/accounts').json({
      name: faker.person.fullName(),
      password: faker.internet.password(),
      email,
    })

    expect(response.status()).toBe(422)
  })
})

test.group('invalid http body request', () => {
  test('returns 422 with invalid name', async ({ expect, client }) => {
    const name = faker.number.float()
    const password = faker.internet.password()
    const email = faker.internet.email()
    const response = await client.post('/accounts').json({
      name,
      password,
      email,
    })

    expect(response.status()).toBe(422)
  })

  test('returns 422 with missing name', async ({ expect, client }) => {
    const name = null
    const password = faker.internet.password()
    const email = faker.internet.email()
    const response = await client.post('/accounts').json({
      name,
      password,
      email,
    })

    expect(response.status()).toBe(422)
  })

  test('returns 422 with invalid email', async ({ expect, client }) => {
    const name = faker.person.fullName()
    const password = faker.internet.password()
    const email = faker.lorem.sentence()
    const response = await client.post('/accounts').json({
      name,
      password,
      email,
    })

    expect(response.status()).toBe(422)
  })

  test('returns 422 with missing email', async ({ expect, client }) => {
    const name = faker.person.fullName()
    const password = faker.internet.password()
    const email = null
    const response = await client.post('/accounts').json({
      name,
      password,
      email,
    })

    expect(response.status()).toBe(422)
  })

  test('returns 422 with missing password', async ({ expect, client }) => {
    const name = faker.person.fullName()
    const password = null
    const email = faker.internet.email()
    const response = await client.post('/accounts').json({
      name,
      password,
      email,
    })

    expect(response.status()).toBe(422)
  })

  test('returns 422 with missing email and password', async ({ expect, client }) => {
    const name = faker.person.fullName()
    const password = null
    const email = null
    const response = await client.post('/accounts').json({
      name,
      password,
      email,
    })

    expect(response.status()).toBe(422)
  })

  test('returns 422 with missing name, email and password', async ({ expect, client }) => {
    const name = null
    const password = null
    const email = null
    const response = await client.post('/accounts').json({
      name,
      password,
      email,
    })

    expect(response.status()).toBe(422)
  })

  test('returns 422 invalid params', async ({ expect, client }) => {
    const response = await client.post('/accounts').json({
      foo: 'bar',
    })

    expect(response.status()).toBe(422)
  })
})
