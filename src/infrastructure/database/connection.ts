import knex from 'knex';
import config from '../../../knexfile';

// Inicializa a instância do Knex usando a configuração de desenvolvimento
// Em produção, poderíamos alternar baseado em variáveis de ambiente
const db = knex(config.production);

export { db };