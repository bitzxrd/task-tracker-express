import express, { Request, Response } from 'express';
import { TGetCardsResponse, TCard, TCreateCardRequest, TUpdateCardRequest } from '../types/cards';
import { TCardIdParams, TColumnIdParams } from '../types/common';
import {
  createCard,
  deleteCard,
  getManyCards,
  getOneCard,
  updateCard,
} from '../database/cards-repository';
import { randomUUID } from 'crypto';
import { validateCardInput } from '../validation';
import { checkCardExistsence, checkColumnExistsence } from './middleware';
import { getOneColumn } from '../database/columns-repository';

export const cardsRouter = express.Router({ mergeParams: true });

cardsRouter.get(
  '/',
  async (
    request: Request<TColumnIdParams, {}>,
    response: Response<TGetCardsResponse>,
  ) => {
    const cards = await getManyCards(request.params);
    response.json(cards);
  },
);

cardsRouter.get(
  '/:cardId',
  async (
    request: Request<TCardIdParams, {}>,
    response: Response<TCard | string>,
  ) => {
    const card = await getOneCard(request.params);

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
  checkColumnExistsence,
  validateCardInput,
  async (
    request: Request<TColumnIdParams, TCard, TCreateCardRequest>,
    response: Response<TCard>,
  ) => {
    const card: TCard = {
      id: randomUUID(),
      text: request.body.text,
      columnId: request.params.columnId,
    };

    await createCard(card);

    response.send(card);
  },
);

cardsRouter.put(
  '/:cardId',
  validateCardInput,
  checkCardExistsence,
  async (
    request: Request<TCardIdParams, TCard, TUpdateCardRequest>,
    response: Response<TCard | string>,
  ) => {
    if (request.params.columnId !== request.body.columnId) {
      const column = await getOneColumn(request.body.columnId, request.params.boardId);

      if (!column) {
        response.status(404).send('Column not found');
        return;
      }
    }

    const card: TCard = {
      id: request.params.cardId,
      text: request.body.text,
      columnId: request.body.columnId,
    };

    await updateCard(card);

    response.send(card);
  },
);

cardsRouter.delete(
  '/:cardId',
  checkCardExistsence,
  async (request: Request<TCardIdParams>, response: Response<void>) => {
    await deleteCard(request.params.cardId, request.params.columnId);
    response.sendStatus(204);
  },
);
