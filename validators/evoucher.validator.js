import joi from 'joi';
import joiDate from '@joi/date'
import { errorResponse } from '../utils/responses.js';

const Joi = joi.extend(joiDate);

export const evoucherValidation = async (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().optional(),
        expiryDate: Joi.date().format(['MM-DD-YYYY', 'MM/DD/YYYY']),
        amount: Joi.number().required(),
        paymentMethod: Joi.string().optional(),
        quantity: Joi.number().required(),
        buyType: Joi.string().optional(),
        eVoucherBuyLimit: Joi.number().required(),
        eVoucherGiftLimit: Joi.number().optional(),
    })

    const { error } = schema.validate(req.body, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    });

    if (error) {
        return res.status(406).json(errorResponse(error));
    }

    next();

};

export const purchaseVoucherValidation = async (req, res, next) => {
    const schema = Joi.object({
        quantity: Joi.number().required(),
        paymentMethod: Joi.string().required(),
        cardNumber: Joi.string().optional(),
        cardExpiryDate: Joi.string().optional(),
        cardCVV: Joi.string().optional()
    })

    const { error } = schema.validate(req.body, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    });

    if (error) {
        return res.status(406).json(errorResponse(error));
    }

    next();
}
