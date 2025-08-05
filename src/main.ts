import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: ['http://localhost:5173', 'https://citas-m8uo507kc-ronald-ures-projects.vercel.app/'], // o '*', pero más seguro definir el origen
    credentials: true, // si usas cookies
  });
  
  await app.listen(3000);
  
  console.log(`🚀 Servidor corriendo en http://localhost:3000`);
}
bootstrap();