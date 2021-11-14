import { Router } from 'express';
import { verifyPromoCode, getPurchaseHistory } from '../services/promoCode.service.js';
import { successResponse, errorResponse } from '../utils/responses.js';

const router = Router();

router.post('/verify', (req, res) => {
    const { promoCode } = req.body;
    const { phoneNumber } = req.user;
    verifyPromoCode(promoCode, phoneNumber).then(data => {
        res.status(200).json(successResponse())
    }).catch(error => {
        res.status(error.statusCode || 500).json(errorResponse(error));
    })
})

router.get('/purchase-history', (req, res) => {
    const { phoneNumber } = req.user;

    getPurchaseHistory(phoneNumber).then(data => {
        res.status(200).json(successResponse(data))
    }).catch(error => {
        res.status(error.statusCode || 500).json(errorResponse(error));
    })
})

export default router;