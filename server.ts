import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.json());

  // Mount API Handlers from /api folder
  app.all('/api/health', async (req, res) => {
    try {
      const { default: handler } = await import('./api/health.js');
      await handler(req, res);
    } catch (err: any) {
      console.error('Health API error:', err);
      res.status(500).json({ error: 'Internal Health API Error', details: err?.message });
    }
  });

  app.all('/api/bus-arrival', async (req, res) => {
    try {
      const { default: handler } = await import('./api/bus-arrival.js');
      await handler(req, res);
    } catch (err: any) {
      console.error('Bus Arrival API error:', err);
      res.status(500).json({ error: 'Internal Bus Arrival API Error', details: err?.message });
    }
  });

  // In development, hook up Vite dev middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist folder
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`SBS Transit NextBus server running on http://localhost:${port}`);
    console.log(`- Health Check API: http://localhost:${port}/api/health`);
    console.log(`- Bus Arrival API: http://localhost:${port}/api/bus-arrival?BusStopCode=83139`);
  });
}

startServer();
