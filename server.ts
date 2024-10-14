import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { Server } from 'socket.io';
import http from 'http';
import connectDB from './src/connection/connection';
import userRoutes from './src/routes/user.route';
import chatRoutes from './src/routes/chat.route';
import { saveChatMessage } from './src/services';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

connectDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world! Your Express server is running.');
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);  // Use chat routes

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

let onlineUsers: { socketId: string; userId: string, userName: string }[] = [];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (data) => {
    onlineUsers.push({ socketId: socket.id, userId: data.userId, userName: data.userName });
    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('privateMessage', async ({ message, to }) => { 
  const sender = onlineUsers.find((user) => user.socketId === socket.id);
  const recipient = onlineUsers.find((user) => user.socketId === to);

  if (sender && recipient) {
    const response = await saveChatMessage(sender.userId, recipient.userId, message);
    io.to(to).emit('message', response);
  }
});

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit('onlineUsers', onlineUsers);
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
