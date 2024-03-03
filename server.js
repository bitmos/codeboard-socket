const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"] // Allow GET and POST methods
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on('editor:update', (roomId, data) => {
    io.to(roomId).emit('editor:update', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('typing', (roomId, text) => {
    io.to(roomId).emit('typing', text);
  });

  socket.on('typingEnd', (roomId, text) => {
    io.to(roomId).emit('typingEnd', text);
  });
});

server.listen(5000, () => {
  console.log('listening on *:5000');
});
