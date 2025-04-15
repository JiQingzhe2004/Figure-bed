import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Define the structure of a User object (optional but good practice)
export interface User extends RowDataPacket {
    id: number;
    username: string;
    email: string;
    password: string;
    role: string; // 用户角色: 'user' 或 'admin'
    avatar_path?: string; // 添加可选的头像路径
    created_at: Date;
    last_login: Date | null;
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
            password: userRow.password,
            role: userRow.role,
            avatar_path: userRow.avatar_path,
            created_at: userRow.created_at,
            last_login: userRow.last_login,
            constructor: { name: "RowDataPacket" }
        };
    }
    return null;
};

// 更详细地检查用户查询结果
export const findUserByUsername = async (username: string): Promise<User | null> => {
    console.log(`查询用户: ${username}`);
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE username = ?',
        [username]
    );
    
    if (rows.length === 0) {
        console.log(`未找到用户: ${username}`);
        return null;
    }
    
    const userRow = rows[0];
    console.log(`数据库返回用户: ID=${userRow.id}, 用户名=${userRow.username}`);
    
    // 检查关键字段是否存在
    if (!userRow.password) {
        console.error(`用户 ${username} 的密码字段为空`);
    }
    
    // 直接返回数据库行，确保所有字段都被传递
    return {
        id: userRow.id,
        username: userRow.username,
        email: userRow.email,
        password: userRow.password,
        role: userRow.role,
        avatar_path: userRow.avatar_path,
        created_at: userRow.created_at,
        last_login: userRow.last_login,
        constructor: { name: "RowDataPacket" }
    };
};

// Function to create a new user
export const createUser = async (user: Omit<User, 'id' | 'created_at' | 'last_login'>): Promise<number> => {
    const { username, email, password, role = 'user' } = user;
    const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [username, email, password, role]
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
            password: userRow.password,
            role: userRow.role,
            avatar_path: userRow.avatar_path,
            created_at: userRow.created_at,
            last_login: userRow.last_login,
            constructor: { name: "RowDataPacket" }
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

// 更新最后登录时间
export const updateLastLogin = async (userId: number): Promise<boolean> => {
    try {
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
            [userId]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error('更新最后登录时间失败:', error);
        return false;
    }
};

// 更新用户头像
export const updateUserAvatar = async (userId: number, avatarPath: string): Promise<boolean> => {
    const [result] = await pool.query<ResultSetHeader>(
        'UPDATE users SET avatar_path = ? WHERE id = ?',
        [avatarPath, userId]
    );
    return result.affectedRows > 0;
};
