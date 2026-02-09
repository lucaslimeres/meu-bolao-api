import { app } from './infrastructure/http/app';
import { ENVS } from './utils';

const start = async () => {
  try {
    const port = Number(ENVS.CONFIG.PORT) || 3000;
    
    await app.listen({ 
      port, 
      host: '0.0.0.0'
    });

    console.log(`
    🎯 API Meu Bolão Iniciada!
    🚀 URL: http://localhost:${port}
    🔑 Rotas Públicas: /users/register, /auth/login
    🛡️ Rotas Privadas: /championships, /teams, /groups, /matches, /users/promote-user, /predictions
    `);
    
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
