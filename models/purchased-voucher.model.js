import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    promoCode: {
        type: String,
        unique: true,
        required: true
    },
    evoucherId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'evoucher'
    },
    cost: {
        type: Number,
    },
    expiryDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
    strict: true,
    versionKey: false
});

// create indexes
schema.index({ 'promoCode': 1 });
schema.index({ 'phoneNumber': 1 });
schema.index({ 'promoCode': 1, 'phoneNumber': 1, 'isUsed': 1 })

export default mongoose.model("purchased-voucher", schema);