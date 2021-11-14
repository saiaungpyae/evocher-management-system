import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import setupRoutes from './routes/index.js';

dotenv.config();

const app = express();
const { PORT = 3000 } = process.env;

app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

setupRoutes(app);


//  404
app.use('*', (_req, res) => {
    res.status(404).json({ message: 'Request not found' });
});

// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message || "Error Message"
    })
});


const { DB_URI } = process.env;

mongoose
    .connect(DB_URI)
    .then(() => {
        console.log("Database Connected")

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })

    })
    .catch((err) => console.log(err));

mongoose.Promise = global.Promise;