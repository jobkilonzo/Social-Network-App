import bcrypt from 'bcryptjs'
import db from '../database/db.js'
export const register = async (req, res, next) => {
    try {
        // Check if user exists
        const checkQuery = "SELECT * FROM users WHERE username = ?";
        db.query(checkQuery, [req.body.username], (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.length > 0) return res.status(409).json("User already exists");

            // User does not exist, proceed with registration
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.password, salt);

            const insertQuery = "INSERT INTO users (`username`, `email`, `password`, `name`) VALUES (?)";
            const values = [
                req.body.username,
                req.body.email,
                hashedPassword, // hash the password, not plain one
                req.body.name
            ];

            db.query(insertQuery, [values], (err, data) => {
                if (err) return res.status(500).json(err);
                return res.status(201).json({
                    success: true,
                    message: "User has been created",
                    data: data
                });
            });
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};
export const login =async (req, res, next) => {
    
}
export const logout =async (req, res, next) => {
    
}