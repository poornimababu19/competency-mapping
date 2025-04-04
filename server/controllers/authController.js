import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail } from "../models/userModel.js";

export const register = async (req, res) => {
  const { name, email, password, confirmPassword, role, phone, location, company_name, sector, company_website, college_name, stream } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  getUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      location,
      company_name: role === "company" ? company_name : null,
      sector: role === "company" ? sector : null,
      company_website: role === "company" ? company_website : null,
      college_name: role === "student" ? college_name : null,
      stream: role === "student" ? stream : null,
    };

    createUser(newUser, (err) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.status(201).json({ message: "User registered successfully" });
    });
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  getUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, id: user.id, email: user.email, role: user.role });
  });
};
