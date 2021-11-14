
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import cardValid from 'card-validator';
import randomstring from 'randomstring';
import PurchaseVoucherModel from '../models/purchased-voucher.model.js'
import EvoucherModel from '../models/evoucher.model.js';

const ACCEPTABLE_CARD_LIST = ['mastercard', 'visa'];

const generateSinglePromoCode = () => {
    const numerics = randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
    const alphabets = randomstring.generate({
        length: 5,
        charset: 'alphabetic'
    });

    // shuffle random string
    const promoCode = `${numerics}${alphabets}`
        .split('')
        .sort(() => 0.5 - Math.random())
        .join('');

    return promoCode;
}

const generatePromoCodes = async (quantity, codes) => {
    if (quantity === 0) {
        return codes;
    }

    const promoCode = generateSinglePromoCode();
    const existingCode = await PurchaseVoucherModel.findOne({ promoCode });

    if (existingCode || codes.includes(promoCode)) {
        return generatePromoCodes(quantity, codes)
    } else {
        return generatePromoCodes(quantity - 1, [...codes, promoCode]);
    }
}

export const purchaseVoucher = async (voucherId, body, phoneNumber) => {
    if (!voucherId) {
        throw new createHttpError.BadRequest('Please provide voucher id');
    }

    const voucher = await EvoucherModel.findById(voucherId);

    if (!voucher) {
        throw new createHttpError.BadRequest('Please provide valid voucher id');
    }

    if (voucher.quantity < body.quantity) {
        throw new createHttpError.BadRequest('Quantity exceed')
    }

    // handle payments
    if (body.paymentMethod === 'credit-card') {
        if (!body.cardNumber) {
            throw new createHttpError.BadRequest('Please provide credit card infomation');
        }

        const cardValidation = cardValid.number(body.cardNumber);

        if (!cardValidation?.isValid) {
            throw new createHttpError.BadRequest('Invalid credit card');
        }

        if (!ACCEPTABLE_CARD_LIST.includes(cardValidation?.card?.type)) {
            throw new createHttpError.BadRequest('Valid only for master card and visa card');
        }
    }

    const purchaseQuantity = body.quantity;

    const promoCodes = await generatePromoCodes(purchaseQuantity, []);
    const cost = voucher.amount * (1 - voucher.paymentDiscount * 0.01);
    const expiryDate = voucher.expiryDate;

    const purchasedVouchers = promoCodes.map(promoCode => ({
        evoucherId: voucher._id,
        phoneNumber,
        promoCode,
        cost,
        expiryDate
    }))

    // const dbSession = await mongoose.startSession();
    // dbSession.startTransaction();

    try {
        await EvoucherModel.findByIdAndUpdate(voucherId, { quantity: voucher.quantity - body.quantity });
        const vouchers = await PurchaseVoucherModel.insertMany(purchasedVouchers);
        // await dbSession.commitTransaction();
        return vouchers;
    } catch (error) {
        // await dbSession.abortTransaction();
        throw new createHttpError.InternalServerError(error);
    }
}

export const verifyPromoCode = async (promoCode, phoneNumber) => {
    if (!promoCode || !phoneNumber) {
        throw new createHttpError.BadRequest();
    }

    // get unused and vallid voucher
    const purchasedVoucher = await PurchaseVoucherModel.findOne({
        promoCode, phoneNumber, isUsed: false
    });

    if (!purchasedVoucher) {
        throw new createHttpError.BadRequest('Invalid promocode');
    }

    await PurchaseVoucherModel.findByIdAndUpdate(purchasedVoucher._id, { isUsed: true });

    return purchasedVoucher._id;
}

export const getPurchaseHistory = async (phoneNumber) => {
    if (!phoneNumber) {
        throw new createHttpError.BadRequest('Please provide phone number');
    }

    const purchasedVouchers = await PurchaseVoucherModel.find({
        phoneNumber
    })

    return purchasedVouchers;
}