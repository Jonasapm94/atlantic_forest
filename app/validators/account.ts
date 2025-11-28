import vine from '@vinejs/vine'

export const createPostValidator = vine.compile(
  vine.object({
    name: vine.string(),
    email: vine.string().email().unique({ table: 'accounts', column: 'email' }),
    password: vine.string(),
  })
)
