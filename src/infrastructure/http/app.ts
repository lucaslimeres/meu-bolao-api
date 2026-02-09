import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { authRoutes, championshipRoutes, groupRoutes, matchRoutes, predictionRoutes, privateUserRoutes, publicUserRoutes, teamRoutes } from './routes';

const app = fastify({ logger: true });

app.register(cors);
app.register(jwt, { 
  secret: process.env.JWT_SECRET || 'meu-bolao-secret-key' 
});

app.register(authRoutes, { prefix: '/auth' });
app.register(privateUserRoutes, { prefix: '/users' });
app.register(publicUserRoutes, { prefix: '/users' });
app.register(championshipRoutes, { prefix: '/championships' });
app.register(teamRoutes, { prefix: '/teams' });
app.register(groupRoutes, { prefix: '/groups' });
app.register(matchRoutes, { prefix: '/matches' });
app.register(predictionRoutes, { prefix: '/predictions' });

app.get('/health', async () => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

export { app };