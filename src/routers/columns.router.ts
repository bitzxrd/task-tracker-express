import express, { Request, Response } from 'express';
import { TGetColumnsResponse, TColumn, TCreateColumnRequest } from '../types/columns';
import { TBoardIdParams, TColumnIdParams } from '../types/common';
import {
  createColumn,
  deleteColumn,
  getManyColumns,
  getOneColumn,
  updateColumn,
} from '../database/columns-repository';
import { randomUUID } from 'crypto';
import { validateColumnInput } from '../validation';

export const columnsRouter = express.Router({ mergeParams: true });

columnsRouter.get(
  '/',
  async (
    request: Request<TBoardIdParams , {}>,
    response: Response<TGetColumnsResponse>,
  ) => {
    const columns = await getManyColumns(request.params.boardId);
    response.json(columns);
  },
);

columnsRouter.get(
  '/:columnId',
  async (
    request: Request<TColumnIdParams, {}>,
    response: Response<TColumn | string>,
  ) => {
    const column = await getOneColumn(request.params.columnId, request.params.boardId);

    if (!column) {
      response.status(404).send('Column not found');
      return;
    } else {
      response.json(column);
    }
  },
);

columnsRouter.post(
  '/',
  validateColumnInput,
  async (
    request: Request<TBoardIdParams, TColumn, TCreateColumnRequest>,
    response: Response<TColumn>,
  ) => {
    const column: TColumn = {
      id: randomUUID(),
      name: request.body.name,
      boardId: request.params.boardId,
    };

    await createColumn(column);

    response.send(column);
  },
);

columnsRouter.put(
  '/:columnId',
  validateColumnInput,
  async (
    request: Request<TColumnIdParams, TColumn, TCreateColumnRequest>,
    response: Response<TColumn>,
  ) => {
    const column: TColumn = {
      id: request.params.columnId,
      name: request.body.name,
      boardId: request.params.boardId,
    };

    await updateColumn(column);

    response.send(column);
  },
);

columnsRouter.delete(
  '/:columnId',
  async (request: Request<TColumnIdParams>, response: Response<void>) => {
    await deleteColumn(request.params.columnId, request.params.boardId);
    response.sendStatus(204);
  },
);
