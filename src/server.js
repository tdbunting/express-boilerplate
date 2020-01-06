const app = require('./app')
const { PORT, HOST } = require('./config/keys')

app.listen(PORT, HOST, () => {
  console.log(`
  Server running at http://${HOST}:${PORT}
  `)
})