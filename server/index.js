import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT;

dotenv.config();

const connect = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log('mongodb connected');
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on('disconnected', () => {
    console.log('mongoDB disconnected!');
});

app.get('/', (req, res) => {
    res.send('Hello from Travel app');
});

app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true
    })
);

app.use(morgan('common'));
app.listen(PORT, () => {
    console.log('Listening on port 5500');
    connect();
});
