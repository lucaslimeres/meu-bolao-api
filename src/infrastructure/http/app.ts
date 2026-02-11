import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { ENVS } from '@/utils';
import { adminAuditLogsRoutes, adminChampionshipRoutes, adminGroupRoutes, adminMatchRoutes, adminTeamRoutes, adminUserRoutes, privateGroupRoutes, privateMatchRoutes, privatePredictionRoutes, privateTeamRoutes, publicAuthRoutes, publicUserRoutes } from './routes';

const app = fastify({ logger: true });

app.register(cors);
app.register(jwt, { 
  secret: ENVS.CONFIG.JWT_SECRET || 'meu-bolao-secret-key' 
});

// PUBLICS ROUTES
app.register(publicAuthRoutes, { prefix: '/auth' });
app.register(publicUserRoutes, { prefix: '/users' });

// PRIVATE ROUTES
app.register(privateGroupRoutes, { prefix: '/groups' });
app.register(privatePredictionRoutes, { prefix: '/predictions' });
app.register(privateMatchRoutes, { prefix: '/matches' });
app.register(privateTeamRoutes, { prefix: '/teams' });

// ADMIN ROUTES
app.register(adminUserRoutes, { prefix: '/admin/users' });
app.register(adminChampionshipRoutes, { prefix: '/admin/championships' });
app.register(adminTeamRoutes, { prefix: '/admin/teams' });
app.register(adminMatchRoutes, { prefix: '/admin/matches' });
app.register(adminGroupRoutes, { prefix: '/admin/groups' });
app.register(adminAuditLogsRoutes, { prefix: '/admin/audit-logs' });

app.get('/health', async () => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

export { app };