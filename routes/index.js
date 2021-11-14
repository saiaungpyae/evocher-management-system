import { verifyToken } from '../middlewares/auth.middleware.js';
import authRoute from './auth.route.js';
import evoucherRoute from './evoucher.route.js';
import promoCodeRoute from './promoCode.route.js';

export default (app) => {
    app.use('/api/auth', authRoute);
    app.use('/api/vouchers', verifyToken, evoucherRoute);
    app.use('/api/promo-codes', verifyToken, promoCodeRoute);
};