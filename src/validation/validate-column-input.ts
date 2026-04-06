import { Request, Response } from 'express';
import { TColumn, TCreateColumnRequest } from '../types/columns';
import { TBoardIdParams } from '../types/common';

export const validateColumnInput = (
  { body }: Request<TBoardIdParams, TColumn, TCreateColumnRequest>,
  response: Response,
  next: () => void,
): void => {
  if (typeof body !== 'object' || !body.name || typeof body.name !== 'string') {
    response.status(400).send({
      error: 'Validation error',
    });

    return;
  }

  next();
};
