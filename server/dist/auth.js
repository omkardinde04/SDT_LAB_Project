import jwt from 'jsonwebtoken';
import { db } from './db.js';
export const JWT_SECRET = process.env.JWT_SECRET || 'campustour_super_secret_jwt_key_2026';
export function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
    }, JWT_SECRET, { expiresIn: '7d' });
}
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Authentication required. No token provided.' });
        return;
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err || !decoded) {
            res.status(401).json({ error: 'Invalid or expired session token.' });
            return;
        }
        const users = db.get('users');
        const user = users.find((u) => u.id === decoded.id);
        if (!user) {
            res.status(401).json({ error: 'User account not found.' });
            return;
        }
        if (user.disabled) {
            res.status(403).json({ error: 'This account has been disabled by an administrator.' });
            return;
        }
        req.user = user;
        next();
    });
}
export function requireRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized. Please sign in.' });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                error: `Access denied. Role "${req.user.role}" does not have permission to access this resource.`,
            });
            return;
        }
        next();
    };
}
