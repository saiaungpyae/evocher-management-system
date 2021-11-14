import EvoucherModel from '../models/evoucher.model.js';
import PAYMENT_LIST from '../consts/payment-list.js';
import createHttpError from 'http-errors';

export const createVoucher = async (voucher) => {
    const paymentDiscount = PAYMENT_LIST.find(x => x.type === voucher.paymentMethod)?.discount ?? 0;
    const payload = {
        ...voucher,
        paymentDiscount
    };
    const newVoucher = await new EvoucherModel(payload).save();
    return newVoucher;
}

export const getVoucherList = async () => {
    const vouchers = await EvoucherModel.find({ status: 'ACTIVE' });

    return vouchers;
}

export const getVoucherDetail = async (voucherId) => {
    if (!voucherId) {
        throw new createHttpError.BadRequest('Please provide voucher id');
    }

    const voucher = await EvoucherModel.findById(voucherId);

    if (!voucher) {
        throw new createHttpError.BadRequest('Please provide valid voucher id');
    }

    return voucher;
}

export const updateVoucher = async (voucherId, voucher) => {
    if (!voucherId) {
        throw new createHttpError.BadRequest('Please provide voucher id');
    }

    const oldVoucher = await EvoucherModel.findById(voucherId);

    if (!oldVoucher) {
        throw new createHttpError.BadRequest('Please provide valid voucher id');
    }

    if (oldVoucher.status !== 'ACTIVE') {
        throw new createHttpError.BadRequest('Invalid action');
    }

    const updatedVoucher = await EvoucherModel.findByIdAndUpdate(voucherId, voucher);

    return updatedVoucher;
}

export const deleteVoucher = async (voucherId) => {
    if (!voucherId) {
        throw new createHttpError.BadRequest('Please provide voucher id');
    }

    const oldVoucher = await EvoucherModel.findById(voucherId);

    if (!oldVoucher) {
        throw new createHttpError.BadRequest('Please provide valid voucher id');
    }

    if (oldVoucher.status !== 'ACTIVE') {
        throw new createHttpError.BadRequest('Invalid action');
    }

    await EvoucherModel.findByIdAndUpdate(voucherId, {
        status: 'INACTIVE', deletedAt: new Date()
    })

    return voucherId;
}