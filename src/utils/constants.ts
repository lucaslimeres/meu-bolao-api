import 'dotenv/config';

export const ENVS = {
  CONFIG: {
    JWT_SECRET: process.env.JWT_SECRET || 'meu-bolao-secret-key',
    PORT: Number(process.env.PORT) || 3000,
    DB: {
      HOST: process.env.DB_HOST || 'localhost',
      PORT: Number(process.env.DB_PORT) || 3306,
      USER: process.env.DB_USER || 'root',
      PASSWORD: process.env.DB_PASSWORD || '',
      NAME: process.env.DB_NAME || 'meu_bolao_db'
    }
  },

  POINTS_CONFIG: {
    EXACT_SCORE: Number(process.env.EXACT_RESULT_POINTS) || 10,
    WINNER_AND_GOAL_DIFF: Number(process.env.WINNER_AND_GOAL_DIFFERENCE_POINTS) || 7,
    WINNER_ONLY: Number(process.env.WINNER_ONLY_POINTS) || 5,
    ONE_TEAM_GOALS: Number(process.env.ONE_TEAM_GOALS_POINTS) || 2
  }
}