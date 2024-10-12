import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './src/connection/connection';
import userRoutes from './src/routes/user.route'
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
