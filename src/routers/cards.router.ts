import express, { Request, Response } from 'express';
import { TGetCardsResponse, TCard, TCreateCardRequest } from '../types/cards';
import { TIdParams } from '../types/common';

export const cardsRouter = express.Router();

cardsRouter.get(
  '/',
  (request: Request<{}, {}>, response: Response<TGetCardsResponse>) => {
    // TODO: Return cards
  },
);

cardsRouter.get(
  '/:id',
  (request: Request<TIdParams, {}>, response: Response<TCard>) => {
    // TODO: Return card by id
  },
);

cardsRouter.post(
  '/',
  (request: Request<{}, {}, TCreateCardRequest>, response: Response<TCard>) => {
    // TODO: Create a new card
  },
);

cardsRouter.put(
  '/:id',
  (request: Request<TIdParams, {}, TCard>, response: Response<TCard>) => {
    // TODO: Update a card
  },
);

cardsRouter.delete(
  '/:id',
  (request: Request<TIdParams>, response: Response<void>) => {
    // TODO: Delete a card
  },
);
