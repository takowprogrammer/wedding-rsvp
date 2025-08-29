module.exports = {
  schema: './prisma/schema.prisma',
  seed: {
    exec: 'node prisma/seed/seed.js'
  }
}
