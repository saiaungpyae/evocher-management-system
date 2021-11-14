import { Router } from "express";
import jwt from 'jsonwebtoken';
import TokenModel from '../models/token.model.js';
import { errorResponse, successResponse } from '../utils/responses.js';
import config from '../config/index.js'

const router = Router();

router.post('/login', async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        const accessToken = jwt.sign({ phoneNumber }, config.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ phoneNumber }, config.REFRESH_TOKEN_SECRET, { expiresIn: '3d' });

        await TokenModel.create({ phoneNumber, refreshToken });

        res.status(200).json(successResponse({
            accessToken,
            refreshToken
        }));
    } catch (error) {
        res.status(500).json(errorResponse(error));
    }
});

router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(403).json(errorResponse('Refresh token required'));
        }

        const decodedJWT = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);

        const { phoneNumber } = decodedJWT;

        const accessToken = jwt.sign({ phoneNumber }, config.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
        const newRefreshToken = jwt.sign({ phoneNumber }, config.REFRESH_TOKEN_SECRET, { expiresIn: '3d' });

        await TokenModel.create({ phoneNumber, refreshToken: newRefreshToken });

        res.status(200).json(successResponse({
            accessToken,
            refreshToken: newRefreshToken
        }));

    } catch (error) {
        console.log(error)
        return res.status(401).json(errorResponse('Invalid token'));
    }
})

export default router;