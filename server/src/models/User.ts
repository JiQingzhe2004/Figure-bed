import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Define the structure of a User object (optional but good practice)
export interface User {
    id?: number;
    username: string;
    email: string;
    password_hash: string; // Store hashed password
    role?: string; // 用户角色: 'user' 或 'admin'
    created_at?: Date;
}

// Function to find a user by email
export const findUserByEmail = async (email: string): Promise<User | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    if (rows.length > 0) {
        // Map database row to User interface
        const userRow = rows[0];
        return {
            id: userRow.id,
            username: userRow.username,
            email: userRow.email,
            password_hash: userRow.password_hash,
            role: userRow.role,
            created_at: userRow.created_at,
        };
    }
    return null;
};

// Function to find a user by username
export const findUserByUsername = async (username: string): Promise<User | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE username = ?',
        [username]
    );
    if (rows.length > 0) {
        const userRow = rows[0];
        return {
            id: userRow.id,
            username: userRow.username,
            email: userRow.email,
            password_hash: userRow.password_hash,
            role: userRow.role,
            created_at: userRow.created_at,
        };
    }
    return null;
};

// Function to create a new user
export const createUser = async (user: Omit<User, 'id' | 'created_at'>): Promise<number> => {
    const { username, email, password_hash, role = 'user' } = user;
    const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [username, email, password_hash, role]
    );
    return result.insertId; // Return the ID of the newly created user
};

// 根据ID查找用户
export const findUserById = async (id: number): Promise<User | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE id = ?',
        [id]
    );
    if (rows.length > 0) {
        const userRow = rows[0];
        return {
            id: userRow.id,
            username: userRow.username,
            email: userRow.email,
            password_hash: userRow.password_hash,
            role: userRow.role,
            created_at: userRow.created_at,
        };
    }
    return null;
};

// 更新用户角色
export const updateUserRole = async (id: number, role: string): Promise<boolean> => {
    const [result] = await pool.query<ResultSetHeader>(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, id]
    );
    return result.affectedRows > 0;
};
