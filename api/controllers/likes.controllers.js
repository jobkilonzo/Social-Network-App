
import db from '../database/db.js'
import jwt from 'jsonwebtoken'
import moment from "moment"
import { SECRET_KEY } from '../config/env.js';
export const getLikes = (req, res) => {

    const q = ` SELECT userId from likes WHERE postId = ?
`;
    db.query(q, [req.query.postId], (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(data.map(like => like.userId));
    });

}

export const addLike = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    console.log("Incoming post body:", req.body);
    jwt.verify(token, SECRET_KEY, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid");

        console.log("User ID from token:", userInfo.id);
        console.log("Decoded user info:", userInfo);
        const q = `
  INSERT INTO likes (userId, postId)
  VALUES (?, ?)
`;
        const values = [
            userInfo.id,
            req.body.postId
        ];

        db.query(q, values, (err, data) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json(err);
            }
            return res.status(200).json("Post has been liked");
        });
    });

}
export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `
      DELETE FROM likes WHERE userId = ? AND postId = ?
    `;

    db.query(q, [userInfo.id, req.query.postId], (err, data) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json(err);
      }
      return res.status(200).json("Post has been disliked");
    });
  });
};
