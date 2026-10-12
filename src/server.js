const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');

const connectDB = require('./config/db');
const Message = require('./models/Message');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Real-Time Chat WebSocket Events with MongoDB Persistence
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_ticket', (ticketId) => {
    socket.join(ticketId);
    console.log(`User joined ticket room: ${ticketId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const newMessage = await Message.create({
        ticket: data.ticket,
        sender: data.sender,
        message: data.message
      });

      const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'name role');
      io.to(data.ticket).emit('receive_message', populatedMessage);
    } catch (error) {
      console.error('Error saving message:', error.message);
    }
  });

  socket.on('typing', (data) => {
    socket.to(data.ticket).emit('display_typing', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});