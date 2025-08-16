import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seedOnBoot } from './seed-on-boot';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowlist = (process.env.FRONTEND_URL ?? 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean);

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const ok = allowlist.some((a) => origin.startsWith(a));
      return cb(ok ? null : new Error('Not allowed by CORS'), ok);
    },
    credentials: true,
  });

  if (process.env.SEED_ON_BOOT === 'true') {
    console.log('Running seed on boot...');
    await seedOnBoot();
  }

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 App on http://localhost:${port} | Allowlist: ${allowlist.join(', ')}`);
}
bootstrap();
