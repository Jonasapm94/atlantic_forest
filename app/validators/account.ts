import vine from '@vinejs/vine'

export const createPostValidator = vine.compile(
  vine.object({
    name: vine.string(),
    email: vine.string().email().unique({ table: 'accounts', column: 'email' }),
    password: vine.string(),
  })
)

export const createSessionValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)
