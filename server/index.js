const NODE_PORT = 8082
const path = require('path');
const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/ai', function(req, res) {
  res.sendFile(path.join(__dirname, '../client/ai.html'));
});

app.use(express.static('client'))

server.listen(NODE_PORT, (err) => {
  if (err) {
    throw new Error(err);
  }
  console.log(`Listening port ${NODE_PORT}`);
});

io.on('connection', (socket) => {
  const { id } = socket;

  console.log('connection')

  socket.broadcast.emit('join');
  console.log('send join')

  socket.on('params', (params) => {
    console.log('params')

    const {
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
      //isHit,
      //isShot,
      //isShooting,
      //lastShootAt,
      name,
      //points
    } = params;

    const newParams = {
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
      //isHit,
      //isShot,
      //isShooting,
      //lastShootAt,
      name,
      //points
    };

    /*if (isHit || isShot) {
      newParams.x = Math.round(Math.random() * 1500);
      newParams.y = Math.round(Math.random() * 1500);
      newParams.isHit = false;
      newParams.isShot = false;
    }*/

    socket.broadcast.emit('params', {
      id,
      params: newParams
    });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('leave', id);
  });
});
