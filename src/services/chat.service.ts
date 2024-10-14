import { Chat, IChat } from "../schemas";

// Save a chat message to the database
export const saveChatMessage = async (
  senderId: string,
  recipientId: string,
  message: string
): Promise<IChat> => {
  const chatMessage = new Chat({
    sender: senderId,
    recipient: recipientId,
    message,
  });

  const res = await chatMessage.save();
  // Populate only the name fields of sender and recipient
  await res.populate({
    path: 'sender recipient',
    select: 'name', // Select only the name field
  })
  
  return res;
};

// Fetch chat history between two users
export const getChatHistory = async (
  senderId: string,
  recipientId: string
): Promise<IChat[]> => {
  return await Chat.find({
    $or: [
      { sender: senderId, recipient: recipientId },
      { sender: recipientId, recipient: senderId },
    ],
  })
    .populate('sender', 'name')  // Populate sender's name
    .populate('recipient', 'name')  // Populate recipient's name
    .sort({ createdAt: 1 });  // Sort by ascending order of creation
};
