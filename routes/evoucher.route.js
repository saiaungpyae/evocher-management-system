import { Router } from 'express';
import PAYMENT_LIST from '../consts/payment-list.js';
import { createVoucher, deleteVoucher, getVoucherDetail, getVoucherList, updateVoucher } from '../services/evoucher.service.js';
import { purchaseVoucher } from '../services/promoCode.service.js';
import { successResponse, errorResponse } from '../utils/responses.js';
import { evoucherValidation, purchaseVoucherValidation } from '../validators/evoucher.validator.js';

const router = Router();

router.post('/', evoucherValidation, (req, res) => {
    createVoucher(req.body).then(data => {
        res.status(201).json(successResponse(data));
    }).catch(error => {
        res.status(error.statusCode || 500).json(errorResponse(error));
    })
})

router.get('/', (req, res) => {
    getVoucherList().then(data => {
        res.status(200).json(successResponse(data));
    }).catch(error => {
        res.status(error.statusCode || 500).json(errorResponse(error));
    })
});

router.get('/payment-methods', (req, res) => {
    const paymentMethods = PAYMENT_LIST;
    res.status(200).json(successResponse(paymentMethods));
});

router.get('/:voucherId', (req, res) => {
    const { voucherId } = req.params;
    getVoucherDetail(voucherId).then(data => {
        res.status(200).json(successResponse(data));
    }).catch(error => {
        res.status(error.statusCode || 500).json(errorResponse(error));
    })
})

router.put('/:voucherId', evoucherValidation, (req, res) => {
    const { voucherId } = req.params;
    updateVoucher(voucherId, req.body).then(data => {
        res.status(200).json(successResponse(data));
    }).catch(error => {
        res.status(error.statusCode || 500).json(errorResponse(error));
    })
})

router.delete('/:voucherId', (req, res) => {
    const { voucherId } = req.params;
    deleteVoucher(voucherId).then(data => {
        res.status(200).json(successResponse());
    }).catch(error => {
        res.status(error.statusCode || 500).json(errorResponse(error));
    })
})

router.post('/:voucherId/purchase', purchaseVoucherValidation, (req, res) => {
    const { voucherId } = req.params;
    const { phoneNumber } = req.user;
    purchaseVoucher(voucherId, req.body, phoneNumber).then(data => {
        res.status(200).json(successResponse());
    }).catch(error => {
        res.status(error.statusCode || 500).json(errorResponse(error));
    })
})

export default router;