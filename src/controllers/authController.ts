import { Request, Response } from "express";
import jwt from "jsonwebtoken";

// Mock user store (in-memory)
const mockUsers: { [username: string]: string } = {}; 

// Helper to generate token
const generateToken = (id: string) => {
  const secret = process.env.JWT_SECRET || "mock_secret"; 
  return jwt.sign({ id }, secret, { expiresIn: "1h" });
};

// Mock Register
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  if (mockUsers[username]) {
    res.status(400).json({ message: "Username already exists (mock)" });
    return;
  }

  mockUsers[username] = password;

  console.log("Registered (mock):", username);
  res.status(201).json({ message: "Mock user registered successfully" });
};

// Mock Login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  const storedPassword = mockUsers[username];
  if (!storedPassword) {
    res.status(400).json({ message: "Invalid mock username" });
    return;
  }

  if (storedPassword !== password) {
    res.status(400).json({ message: "Invalid mock password" });
    return;
  }

  const token = generateToken(username);
  res.json({ message: "Mock login successful", token });
};
