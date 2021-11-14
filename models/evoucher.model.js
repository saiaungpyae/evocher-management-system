import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    expiryDate: {
        type: Date
    },
    image: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String
    },
    paymentDiscount: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 0
    },
    buyType: {
        type: String,
        enum: ['ONLY_ME', 'GIFT_TO_OTHERS'],
        default: ['ONLY_ME']
    },
    eVoucherBuyLimit: { /** Voucher limit for a single user */
        type: Number,
        required: true
    },
    eVoucherGiftLimit: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE'
    },
    deletedAt: {
        type: Date
    }
}, {
    timestamps: true,
    strict: true,
    versionKey: false
});

export default mongoose.model("evoucher", schema);