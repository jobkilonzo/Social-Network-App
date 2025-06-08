import bcrypt from 'bcryptjs'
import db from '../database/db.js'
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/env.js';
export const register = async (req, res, next) => {
    console.log("connect");

    const checkQuery = "SELECT * FROM users WHERE username = ?";

    db.query(checkQuery, [req.body.username], (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }

        if (data.length > 0) {
            return res.status(409).json({ error: "User already exists" });
        }

        // User does not exist — create new one
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const insertQuery = `
    INSERT INTO users (username, email, password, name)
    VALUES (?, ?, ?, ?)
  `;
        const values = [
            req.body.username,
            req.body.email,
            hashedPassword,
            req.body.name,
        ];

        db.query(insertQuery, values, (err, result) => {
            if (err) {
                console.error("Insert error:", err);
                return res.status(500).json({ error: "Failed to create user", details: err });
            }

            console.log("User created:", result);
            return res.status(201).json({
                success: true,
                message: "User has been created",
                userId: result.insertId, // helpful for frontend
            });
        });
    });

};
export const login = async (req, res, next) => {
    const checkQuery = "SELECT * FROM users WHERE username = ?";
    db.query(checkQuery, [req.body.username], (err, data) => {
        console.log("DB query complete");

        if (err) {
            console.error("DB Error:", err);
            return res.status(500).json(err);
        }

        if (data.length === 0) {
            return res.status(409).json("User not found");
        }

        const user = data[0];

        if (!user.password) {
            return res.status(500).json("Password not found in database");
        }

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json("Wrong password or username");
        }

        const token = jwt.sign({ id: user.id }, SECRET_KEY);

        const { password, ...others } = user;
        res.cookie("accessToken", token, {
            httpOnly: true
        }).status(200).json(others);
    });
}
export const logout = async (req, res, next) => {
    res.clearCookie("accessToke", {
        secure: true,
        sameSite: "none"
    }).status(200).json("user has being logged out")
}