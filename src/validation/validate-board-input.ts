import { Request, Response } from 'express';
import { TBoard, TCreateBoardRequest } from '../types/boards';
import { TIdParams } from '../types/common';

export const validateBoardInput = (
  { body }: Request<TIdParams, TBoard, TCreateBoardRequest>,
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
