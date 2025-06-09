import db from '../database/db.js';
import jwt from 'jsonwebtoken';

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
    console.log("User info:", info);
    return res.status(200).json(info);
  });
};
