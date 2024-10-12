import express, { Request, Response } from 'express';
import { createUser, loginUser } from '../services';

const router = express.Router();
// Signup controller
export const signup = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Login controller
export const login = async (req: Request, res: Response) => {
  try {
    const user = await loginUser(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Define the routes
router.post('/signup', signup); // Signup route
router.post('/login', login);   // Login route

export default router;
