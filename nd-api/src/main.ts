import { NestFactory } from '@nestjs/core';
import type { AddressInfo } from 'node:net';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT) || 3000;

  const server = await app.listen(port);
  const address = server.address();
  const actualPort = typeof address === 'string' ? port : (address as AddressInfo | null)?.port ?? port;
  const url = await app.getUrl();

  // eslint-disable-next-line no-console
  console.log(`[nd-api] Listening on ${url} (port ${actualPort})`);
}
bootstrap();
