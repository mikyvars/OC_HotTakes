const http = require('http')
const app = require('./app')
app.set('port', process.end.PORT || 3000)

const server = http.createServer(app)

server.listen(process.env.PORT || 3000)