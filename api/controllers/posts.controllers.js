import { SECRET_KEY } from '../config/env.js'
import db from '../database/db.js'
import jwt from 'jsonwebtoken'
import moment from 'moment'
export const getPosts = (req, res) => {
    const token = req.cookies.accessToken
    const rawUserId = req.query.userId;
    const userId = rawUserId && !isNaN(parseInt(rawUserId)) ? parseInt(rawUserId) : null;
    if (!token) return res.status(401).json("Not logged in!")

    jwt.verify(token, SECRET_KEY, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid")
        const q = userId !=="undefined" ? `
  SELECT p.*, u.id AS userId, name, profilePic
  FROM posts AS p
  JOIN users u ON (u.id = p.userId)
  WHERE p.userId = ?  ORDER BY p.createdAt DESC
` : `
  SELECT p.*, u.id AS userId, name, profilePic
  FROM posts AS p
  JOIN users u ON (u.id = p.userId)
  LEFT JOIN relationship AS r ON (p.userId = r.followedUserId)
  WHERE r.followerUserId = ? OR p.userId = ?
  ORDER BY p.createdAt DESC
`;
        const values = userId ? [userId] : [userInfo.id, userInfo.id];

        db.query(q, values, (err, data) => {
            console.log(data)
            console.log(userId)
            if (err) return res.status(500).json(err)
            return res.status(200).json(data)
        })
    })
}


export const addPosts = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    console.log("Incoming post body:", req.body);

    jwt.verify(token, SECRET_KEY, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid");
        const q = `
  INSERT INTO posts (\`desc\`, img, createdAt, userId)
  VALUES (?, ?, ?, ?)
`;


        const values = [
            req.body.desc || "",
            req.body.img || "",
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,
        ];


        db.query(q, values, (err, data) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json(err);
            }
            return res.status(200).json("Post has been created");
        });
    });
};

export const deletePosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `DELETE FROM posts WHERE id = ? AND userId = ?`;

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json(err);
      }
      if (data.affectedRows > 0) {
        return res.status(200).json("Post has been deleted");
      } else {
        return res.status(403).json("You can delete only your own post.");
      }
    });
  });
};
