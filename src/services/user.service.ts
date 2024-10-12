import { User, IUser } from '../schemas';
import bcrypt from 'bcryptjs'; // For password hashing
import jwt from 'jsonwebtoken';
// Service for creating a new user (Signup)
export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const { email, password } = userData;

  if (!password) {
    throw new Error('Password is required');
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash the password before saving the user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create and save the new user
  const newUser = new User({
    ...userData,
    password: hashedPassword,
  });
  return newUser.save();
};

// Service for logging in a user (Login)
export const loginUser = async (userData: { email: string; password: string }) => {
  const { email, password } = userData;

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Compare the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Create a JWT token
  const token = jwt.sign(
    { _id: user._id, email: user.email }, // Payload
    process.env.JWT_SECRET as string, // Secret key from environment variable
    { expiresIn: '1h' } // Token expiration time
  );

  // Return the user data along with the token
  return { name: user.name, email: user.email, _id: user._id, token };
};
