import http from 'http';
import express from 'express';
import cors from 'cors';
import env, { validateEnv } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { requestLogger } from './middleware/requestLogger.js';
import { sessionContext } from './middleware/sessionContext.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';
import { initWebSocket } from './websocket/index.js';
import logger from './utils/logger.js';

async function bootstrap() {
  const warnings = validateEnv();
  warnings.forEach((w) => logger.warn(w));

  await connectDatabase();

  const app = express();
  const server = http.createServer(app);

  app.use(
    cors({
      origin: [env.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
      exposedHeaders: ['x-intellios-session'],
    })
  );
  app.use(express.json({ limit: '2mb' }));
  app.use(requestLogger);
  app.use(sessionContext);

  app.get('/', (_req, res) => {
    res.json({
      name: 'IntelliOS AI Core',
      tagline: 'Intelligence Layer v2',
      docs: '/api/health',
      websocket: '/ws',
    });
  });

  app.get('/api/health', (req, res) => {
  res.json({
    status: 'Backend Running'
  });
});

  app.use('/api', apiRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  initWebSocket(server);

  server.listen(env.PORT, () => {
    logger.info(`IntelliOS AI Core online`, {
      port: env.PORT,
      env: env.NODE_ENV,
      groq: env.GROQ_API_KEY ? 'enabled' : 'fallback',
    });
  });

  const shutdown = async () => {
    logger.info('Shutting down IntelliOS AI Core...');
    server.close();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch((err) => {
  logger.error('Fatal bootstrap error', { error: err.message });
  process.exit(1);
});
