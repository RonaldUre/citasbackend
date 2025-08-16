// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seedOnBoot } from './seed-on-boot';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allowlist desde env (puedes pasar varios orígenes separados por coma)
  const allowlist = (process.env.FRONTEND_URL ?? 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim().replace(/\/$/, '')) // quita slash final
    .filter(Boolean);

  app.enableCors({
    origin: (origin, cb) => {
      // Permite herramientas sin origen (Postman/cURL) y SSR
      if (!origin) return cb(null, true);
      const ok = allowlist.some((a) => origin.startsWith(a));
      return cb(ok ? null : new Error('Not allowed by CORS'), ok);
    },
    credentials: true,
  });

  // Ejecuta el seed si la variable está en true
  if (process.env.SEED_ON_BOOT === 'true') {
    console.log('🌱 Running seed on boot...');
    await seedOnBoot();
  }

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(
    `🚀 App listening on http://localhost:${port} | Allowlist: ${allowlist.join(', ')}`
  );
}
bootstrap();
