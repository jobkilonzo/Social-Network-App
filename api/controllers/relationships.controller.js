import db from '../database/db.js'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config/env.js';

export const getRelationships = (req, res) => {
    const q = ` SELECT followerUserId from relationship WHERE followedUserId = ?
    `;
        db.query(q, [req.query.followedUserId], (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json(data.map(relationship => relationship.followerUserId));
        });
    
}

export const addRelationships = (req, res) => {
    const token = req.cookies.accessToken;
        if (!token) return res.status(401).json("Not logged in!");
    
        jwt.verify(token, SECRET_KEY, (err, userInfo) => {
            if (err) return res.status(403).json("Token is not valid");
    
            const q = `
      INSERT INTO relationship (followerUserId, followedUserId)
      VALUES (?, ?)
    `;
            const values = [
                userInfo.id,
                req.body.userId
            ];
    
            db.query(q, values, (err, data) => {
                if (err) {
                    console.error("Database Error:", err);
                    return res.status(500).json(err);
                }
                return res.status(200).json("Following");
            });
        });
    }

export const deleteRelationships = (req, res) => {
    const token = req.cookies.accessToken;
      if (!token) return res.status(401).json("Not logged in!");
    
      jwt.verify(token, SECRET_KEY, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid");
    
        const q = `
          DELETE FROM relationship WHERE followerUserId = ? AND followeDUserId = ?
        `;
    
        db.query(q, [userInfo.id, req.query.userId], (err, data) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json(err);
          }
          return res.status(200).json("Unfollow");
        });
      });

}