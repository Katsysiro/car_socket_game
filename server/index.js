//require('./server/index')
const NODE_PORT = 8082
const path = require('path')
const express = require('express')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/index.html'))
})

app.use(express.static('client'))

server.listen(NODE_PORT, (err) => {
    if (err) {
        throw new Error(err)
    }   

    console.log(`Listening port ${NODE_PORT}`)
})
// node server

io.on('connection', (socket) => {

    const { id } = socket
    console.log(`connection ${id}`)

    socket.broadcast.emit('join')

    /*{
      x,
      y,
      xVelocity,
      yVelocity,
      power,
      reverse,
      angle,
      angularVelocity,
      isTurningLeft,
      isTurningRight,
      isThrottling,
      isReversing,
      name,
    }*/
    socket.on('params', (params) => {
        socket.broadcast.emit('params', {
            id,
            params
        })
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', id)
    })

})
