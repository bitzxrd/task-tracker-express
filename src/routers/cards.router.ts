import express, { Request, Response } from 'express';
import { TGetCardsResponse, TCard, TCreateCardRequest } from '../types/cards';
import { TIdParams } from '../types/common';
import {
  createCard,
  deleteCard,
  getManyCards,
  getOneCard,
  updateCard,
} from '../database/cards-repository';
import { randomUUID } from 'crypto';

export const cardsRouter = express.Router();

cardsRouter.get(
  '/',
  async (request: Request<{}, {}>, response: Response<TGetCardsResponse>) => {
    const cards = await getManyCards();
    response.json(cards);
  },
);

cardsRouter.get(
  '/:id',
  async (
    request: Request<TIdParams, {}>,
    response: Response<TCard | string>,
  ) => {
    const card = await getOneCard(request.params.id);

    if (!card) {
      response.status(404).send('Card not found');
      return;
    } else {
      response.json(card);
    }
  },
);

cardsRouter.post(
  '/',
  async (
    request: Request<{}, TCard, TCreateCardRequest>,
    response: Response<TCard>,
  ) => {
    const card: TCard = {
      id: randomUUID(),
      text: request.body.text,
    };

    await createCard(card);

    response.send(card);
  },
);

cardsRouter.put(
  '/:id',
  async (
    request: Request<TIdParams, TCard, TCreateCardRequest>,
    response: Response<TCard>,
  ) => {
    const card = {
      id: request.params.id,
      text: request.body.text,
    };

    await updateCard(card);

    response.send(card);
  },
);

cardsRouter.delete(
  '/:id',
  async (request: Request<TIdParams>, response: Response<void>) => {
    await deleteCard(request.params.id);
    response.sendStatus(204);
  },
);
