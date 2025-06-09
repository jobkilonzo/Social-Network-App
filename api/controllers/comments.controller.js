
import db from '../database/db.js'
import jwt from 'jsonwebtoken'
import moment from "moment"
import { SECRET_KEY } from '../config/env.js';
export const getComments = (req, res) => {

    const q = `
        SELECT c.*, u.id AS userId, name, profilePic
        FROM comments AS c
        JOIN users u ON (u.id = c.userId)
        WHERE c.postId= ?
        ORDER BY c.createdAt DESC
    `
    db.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json(data)
    })

}
export const addComments = (req, res) => {
 const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    console.log("Incoming post body:", req.body); 
    jwt.verify(token, SECRET_KEY, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid");

        console.log("User ID from token:", userInfo.id); 
        console.log("Decoded user info:", userInfo);
        const q = `
  INSERT INTO comments (\`desc\`, createdAt, userId, postId)
  VALUES (?, ?, ?, ?)
`;


        const values = [
            req.body.desc || "",
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,
            req.body.postId
        ];

        db.query(q, values, (err, data) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json(err);
            }
            return res.status(200).json("Comment has been created");
        });
    });

}