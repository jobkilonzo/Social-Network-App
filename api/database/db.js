import mysql from 'mysql'
import { DATABASE_NAME, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_URL, DATABASE_USER } from '../config/env.js'

 export  const db = mysql.createConnection({
            host: DATABASE_URL,
            port: DATABASE_PORT,
            user: DATABASE_USER,
            password: DATABASE_PASSWORD,
            database: DATABASE_NAME
            // host: 'localhost',
            // port: '3306',
            // user: "root",
            // password: "123456789",
            // database: "social"
 });

export default db