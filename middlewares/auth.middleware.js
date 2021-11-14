import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import { errorResponse } from '../utils/responses.js';

export const verifyToken = (req, res, next) => {
    const token =
        req.headers["x-access-token"] || req.headers["token"];

    if (!token) {
        return res.status(403).json(errorResponse('A token is required for authentication'));
    }
    try {
        const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).json(errorResponse('Invalid token'));
    }
    return next();
};

