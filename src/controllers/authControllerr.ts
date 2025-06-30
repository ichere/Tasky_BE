import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const SKIP_DB = process.env.SKIP_DB === "true";

export const register = async (req: Request, res: Response): Promise<void> => {
  // const { username, password } = req.body;

  const { username, password } = req.body;
  console.log("Mock registering:", username);
  res.status(201).json({ message: "Mock registration successful (DB skipped)" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (SKIP_DB) {
      // 👇 Fake save
      console.log("🧪 [Mock Register] User:", { username, password: hashedPassword });
      res.status(201).json({ message: "Mock user registered (DB skipped)" });
    }

    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered" });
  } catch (error: any) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// export const register = async (req: Request, res: Response) => {
//   const { username, password } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username, password: hashedPassword });
//     await user.save();

//     res.status(201).json({ message: "User registered" });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ message: "Registration failed", error });
//   }
// };


// export const login: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       res.status(400).json({ message: "Invalid credentials" });
//       return;
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       res.status(400).json({ message: "Invalid credentials" });
//       return;
//     }

//     if (!process.env.JWT_SECRET) {
//       throw new Error("JWT_SECRET is not defined");
//     }

//     const token = jwt.sign(
//       { id: user._id, username: user.username },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({ token });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Login failed", error });
//   }
// };

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    if (SKIP_DB) {
      // 🔐 Define mock user for testing
      const mockUsername = "testuser";
      const mockHashedPassword = await bcrypt.hash("qwertyuiop", 10);

      if (username !== mockUsername) {
        res.status(400).json({ message: "Invalid mock username" });
      }

      const isValid = await bcrypt.compare(password, mockHashedPassword);
      if (!isValid) {
        res.status(400).json({ message: "Invalid mock password" });
      }

      const token = jwt.sign({ id: "mockUserId123" }, process.env.JWT_SECRET!);
      res.json({ token, message: "Mock login successful" });
    }

  } catch (error: any) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};