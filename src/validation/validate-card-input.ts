import { Request, Response } from 'express';
import { TCard, TCreateCardRequest } from '../types/cards';
import { TCardIdParams } from '../types/common';

export const validateCardInput = (
  { body }: Request<TCardIdParams, TCard, TCreateCardRequest>,
  response: Response,
  next: () => void,
): void => {
  if (typeof body !== 'object' || !body.text || typeof body.text !== 'string') {
    response.status(400).send({
      error: 'Validation error',
    });

    return;
  }

  next();
};
