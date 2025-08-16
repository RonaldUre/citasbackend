import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client';
import { runSeed } from '../prisma/seed'; // ajusta si la ruta de prisma/ cambia

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allowlist desde env (puedes pasar varios orígenes separados por coma)
  const allowlist = (process.env.FRONTEND_URL ?? 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim().replace(/\/$/, '')) // quita slash final
    .filter(Boolean);

  app.enableCors({
    origin: (origin, cb) => {
      // Permite tools sin origen (Postman/cURL) y SSR
      if (!origin) return cb(null, true);
      const ok = allowlist.some((a) => origin.startsWith(a));
      return cb(ok ? null : new Error('Not allowed by CORS'), ok);
    },
    credentials: true,
  });

  // Seed automático si está habilitado
  if (process.env.SEED_ON_BOOT === 'true') {
    const prisma = new PrismaClient();
    await runSeed();
    await prisma.$disconnect();
  }

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(
    `🚀 App on http://localhost:${port} | Allowlist: ${allowlist.join(', ')}`
  );
}
bootstrap();
