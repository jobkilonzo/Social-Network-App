import db from '../database/db.js';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/env.js';
export const getUsers = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id = ?";

  db.query(q, [userId], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, ...info } = data[0];

    return res.status(200).json(info);
  });
};

export const updateUsers = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = "UPDATE users SET name=?, website=?, profilePic=?, coverPic=? WHERE id=?";
    const values = [
      req.body.name,
      req.body.website,
      req.body.profilePic,
      req.body.coverPic,
      userInfo.id,
    ];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.json("Updated!");
      return res.status(403).json("You can update only your own profile.");
    });
  });

};
