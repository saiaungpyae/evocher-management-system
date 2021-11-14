import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
    strict: true,
    versionKey: false
});

// refresh tokens will no longer available after 3 days
schema.index('createdAt', { expireAfterSeconds: 3600 * 24 * 3 });

export default mongoose.model("token", schema);