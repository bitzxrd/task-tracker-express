import express from 'express';
import { ADMIN_LOGIN, ADMIN_PASSWORD, PORT } from './config';
import { createTables } from './database/create-tables';
import basicAuth from 'express-basic-auth';
import { logger } from './logger';
import { boardsRouter, cardsRouter } from './routers';

async function run() {
  await createTables();

  const server = express();

  server.use(
    basicAuth({
      users: { [ADMIN_LOGIN]: ADMIN_PASSWORD },
      challenge: true,
    }),
  );
  server.use(express.json());

  server.use(logger)

  server.use('/boards', boardsRouter)
  server.use('/cards', cardsRouter);

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

run().catch((err) => {
  console.error('Failed to start the server:', err);
});
