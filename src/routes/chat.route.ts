import express, { Request, Response } from 'express';
import { getChatHistory, saveChatMessage } from '../services';

const router = express.Router();

// POST: Send a new chat message
router.post('/send', async (req: Request, res: Response) => {
  const { senderId, recipientId, message } = req.body;

  try {
    const newMessage = await saveChatMessage(senderId, recipientId, message);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// GET: Get chat history between two users
router.get('/history', async (req: Request, res: Response) => {
  const { senderId, recipientId } = req.query; // Receives query parameters

  try {
    const chatHistory = await getChatHistory(senderId as string, recipientId as string); // Fetch chat history
    res.status(200).json(chatHistory); // Return history
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

export default router;
