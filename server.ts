import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { Server } from 'socket.io';
import http from 'http';
import connectDB from './src/connection/connection';
import userRoutes from './src/routes/user.route';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

connectDB();

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world! Your Express server is running.');
});

app.use('/api/user', userRoutes);

// Create HTTP server
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Allow your frontend origin
    methods: ['GET', 'POST'],
  },
});

let onlineUsers: { socketId: string; userName: string }[] = [];

// Listen for socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle user joining
  socket.on('join', (userName: string) => {
    onlineUsers.push({ socketId: socket.id, userName });
    console.log('Online Users:', onlineUsers);
    io.emit('onlineUsers', onlineUsers); // Broadcast online users
  });

  // Handle private messages
  socket.on('privateMessage', ({ message, to }) => {
    const sender = onlineUsers.find((user) => user.socketId === socket.id); // Get sender's username
    const recipient = onlineUsers.find((user) => user.socketId === to); // Get recipient's username
    if (sender && recipient) {
      // Send message with sender's username and recipient's username
      io.to(to).emit('message', { message, userName: sender.userName });
      
      // Emit recipient's name back to the sender so you can display it
      socket.emit('recipientName', recipient.userName);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit('onlineUsers', onlineUsers); // Broadcast updated users
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
