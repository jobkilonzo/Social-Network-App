import { config } from "dotenv";


config({path: `.env.${process.env.NODE_ENV || 'development'}.local`})

export const {
    PORT,
    NODE_ENV,
    DATABASE_URL,
    DATABASE_PORT,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_NAME,
    SECRET_KEY
} = process.env