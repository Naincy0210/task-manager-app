import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const register = async (req: Request, res: Response) => {
try {
const { name, email, password, role } = req.body;

```
let user = await User.findOne({ email });
if (user) {
  return res.status(400).json({ message: "User already exists" });
}

user = new User({ name, email, password, role });
await user.save();

const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET || "secret",
  { expiresIn: "1d" }
);

res.cookie("token", token, {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
});

res.status(201).json({
  token,
  user: { id: user._id, name: user.name, role: user.role },
});
```

} catch (err) {
res.status(500).json({ message: "Server error" });
}
};

export const login = async (req: Request, res: Response) => {
try {
const { email, password } = req.body;

```
const user: any = await User.findOne({ email });
if (!user) {
  return res.status(400).json({ message: "Invalid credentials" });
}

const isMatch = await user.comparePassword(password);
if (!isMatch) {
  return res.status(400).json({ message: "Invalid credentials" });
}

const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET || "secret",
  { expiresIn: "1d" }
);

res.cookie("token", token, {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
});

res.json({
  token,
  user: { id: user._id, name: user.name, role: user.role },
});
```

} catch (err) {
res.status(500).json({ message: "Server error" });
}
};

export const getMe = async (req: any, res: Response) => {
try {
const user = await User.findById(req.user.userId).select("-password");
res.json(user);
} catch (err) {
res.status(500).json({ message: "Server error" });
}
};

export const getUsers = async (req: Request, res: Response) => {
try {
const users = await User.find().select("name email role");
res.json(users);
} catch (err) {
res.status(500).json({ message: "Server error" });
}
};

export const logout = (req: Request, res: Response) => {
res.clearCookie("token");
res.json({ message: "Logged out successfully" });
};
