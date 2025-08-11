// Centralized configuration loader (no secrets here, just mapping env vars).
export default () => ({
  env: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  databaseUrl: process.env.DATABASE_URL ?? '',
  frontendUrl: process.env.FRONTEND_URL ?? '',
  // Useful for Prisma or app logging; keep as string, validate with Joi below.
  logLevel: process.env.LOG_LEVEL ?? 'info', // 'query' | 'info' | 'warn' | 'error'
});