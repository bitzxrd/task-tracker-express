import { NextFunction, Request, Response } from 'express';
import { TColumnIdParams } from '../../types/common';
import { getOneColumn } from '../../database/columns-repository';

export const checkColumnExistsence = async (
  { params: { columnId, boardId } }: Request<TColumnIdParams>,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const column = await getOneColumn(columnId, boardId);

  if (column) {
    next();
    return;
  }

  response.status(404).send('Column not found');
};
