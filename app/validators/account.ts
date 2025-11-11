import vine from '@vinejs/vine'

export const createPostValidator = vine.compile(
  vine.object({
    name: vine.string(),
    email: vine.string().email(),
    password: vine.string(),
  })
)
