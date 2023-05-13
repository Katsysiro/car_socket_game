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

io.on('connection', (socket) => {
    
    const { id } = socket
    console.log(`Connection ${id}`)

    socket.broadcast.emit('join')

    socket.on('params', (params) => {
        socket.broadcast.emit('params', {
            id,
            params
        })
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', id)
        console.log(`Disconnect ${id}`)
    })
})