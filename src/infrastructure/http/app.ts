import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { authRoutes, championshipRoutes, groupRoutes, matchRoutes, predictionRoutes, privateUserRoutes, publicUserRoutes, teamRoutes } from './routes';
import { ENVS } from '@/utils';

const app = fastify({ logger: true });

app.register(cors);
app.register(jwt, { 
  secret: ENVS.CONFIG.JWT_SECRET || 'meu-bolao-secret-key' 
});

// PUBLICS ROUTES
app.register(authRoutes, { prefix: '/auth' });
app.register(publicUserRoutes, { prefix: '/users' });

// PRIVATE ROUTES
app.register(groupRoutes, { prefix: '/groups' });
app.register(predictionRoutes, { prefix: '/predictions' });

// ADMIN ROUTES
app.register(privateUserRoutes, { prefix: '/users' });
app.register(championshipRoutes, { prefix: '/championships' });
app.register(teamRoutes, { prefix: '/teams' });
app.register(matchRoutes, { prefix: '/matches' });

app.get('/health', async () => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

export { app };