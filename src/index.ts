import express from 'express';
import { PORT } from './config';
import { cardsRouter } from './routers/cards.router';
import { createTables } from './database/create-tables';

async function run() {

  await createTables();

  const server = express();
  server.use(express.json());

  server.use('/cards', cardsRouter);

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

run().catch((err) => {
  console.error('Failed to start the server:', err);
});