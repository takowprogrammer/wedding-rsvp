import { defineConfig } from '@prisma/internals'

export default defineConfig({
  schema: './prisma/schema.prisma',
  seed: {
    exec: 'node prisma/seed/seed.js'
  }
})
