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
    origin: 'http://localhost:5173', // Allow all origins (you can restrict as needed)
    methods: ['GET', 'POST'],
  },
});

let onlineUsers: { socketId: string; userName: string }[] = [];

// Listen for socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id); // Should print when a client connects

  socket.on('join', (userName: string) => {
    onlineUsers.push({ socketId: socket.id, userName });
    console.log(onlineUsers); // Should print online users
    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('chatMessage', (message) => {
    console.log('checking message', message); // Should print when a message is sent
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit('onlineUsers', onlineUsers);
    console.log('A user disconnected:', socket.id); // Should print when a user disconnects
  });
});


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
