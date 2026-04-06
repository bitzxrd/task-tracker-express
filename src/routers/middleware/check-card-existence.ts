import { NextFunction, Request, Response } from 'express';
import { TCardIdParams } from '../../types/common';
import { getOneCard } from '../../database/cards-repository';

export const checkCardExistsence = async (
  { params }: Request<TCardIdParams>,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const card = await getOneCard(params);

  if (card) {
    next();
    return;
  }

  response.status(404).send('Card not found');
};
