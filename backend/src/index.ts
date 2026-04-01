import express from 'express';
import cors from 'cors';
import pricesRouter from './routes/prices';
import budgetRouter from './routes/budget';
import productsRouter from './routes/products';
import vendorsRouter from './routes/vendors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint for monitoring
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), environment: process.env.NODE_ENV || 'development' });
});

// Routes
app.use('/api/prices', pricesRouter);
app.use('/api/budget', budgetRouter);
app.use('/api/products', productsRouter);
app.use('/api/vendors', vendorsRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
