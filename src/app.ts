import express from 'express';
import chatRoutes from './routes/chat';
import { AppError } from './utils/AppError';
import { errorHandler } from './middlewares/errorHandler';

const path = require('path');
const app = express();

// Global middlewares
app.use(express.json());

// Routes
app.use('/demo', express.static(path.join(__dirname, 'public')));
app.use('/chat', chatRoutes);

// Catch all for undefined routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorHandler);

export default app;
