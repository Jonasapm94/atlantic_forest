import { test } from '@japa/runner'
import Account from '../../../app/models/account.js'
import hash from '@adonisjs/core/services/hash'
import { faker } from '@faker-js/faker'
import db from '@adonisjs/lucid/services/db'

test.group('Accounts create (model)', () => {
  test('hashes account password', async ({ assert }) => {
    const password = faker.internet.password()
    const email = faker.internet.email()
    const account = await Account.create({ password, email })

    assert.isTrue(hash.isValidHash(account.password))
    assert.isTrue(await hash.verify(account.password, password))
  })

  test('creates a single account in the database', async ({ expect }) => {
    const initialCountQuery = await db.from('accounts').count('* as total')
    const initialCount = initialCountQuery[0].total

    const password = faker.internet.password()
    const email = faker.internet.email()
    await Account.create({ password, email })

    const finalCountQuery = await db.from('accounts').count('* as total')
    const finalCount = finalCountQuery[0].total

    expect(finalCount).toBe(initialCount + 1)
  })
})

test.group('Accounts create (http request)', () => {
  test('returns status 201 with account properties, without password', async ({
    expect,
    client,
  }) => {
    const name = faker.person.fullName()
    const password = faker.internet.password()
    const email = faker.internet.email()
    const response = await client.post('/accounts').json({
      name,
      password,
      email,
    })

    expect(response.status()).toBe(201)
    expect(response.body()).toEqual({
      name,
      email,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      id: expect.any(Number),
    })
    expect(response.body()).not.toHaveProperty('password')
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
