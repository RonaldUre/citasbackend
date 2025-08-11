import * as Joi from 'joi';

// Validate all required environment variables before the app boots.
export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),

  PORT: Joi.number().default(3000),

  DATABASE_URL: Joi.string().uri().required(),

  FRONTEND_URL: Joi.string().uri().required(),

  // Accept common Prisma/app levels
  LOG_LEVEL: Joi.string()
    .valid('query', 'info', 'warn', 'error')
    .default('info'),
});