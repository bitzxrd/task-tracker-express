import express, { Request, Response } from 'express';
import { TGetBoardsResponse, TBoard, TCreateBoardRequest } from '../types/boards';
import { TIdParams } from '../types/common';
import {
  createBoard,
  deleteBoard,
  getManyBoards,
  getOneBoard,
  updateBoard,
} from '../database/boards-repository';
import { randomUUID } from 'crypto';
import { validateBoardInput } from '../validation';

export const boardsRouter = express.Router();

boardsRouter.get(
  '/',
  async (request: Request<{}, {}>, response: Response<TGetBoardsResponse>) => {
    const boards = await getManyBoards();
    response.json(boards);
  },
);

boardsRouter.get(
  '/:id',
  async (
    request: Request<TIdParams, {}>,
    response: Response<TBoard | string>,
  ) => {
    const board = await getOneBoard(request.params.id);

    if (!board) {
      response.status(404).send('Board not found');
      return;
    } else {
      response.json(board);
    }
  },
);

boardsRouter.post(
  '/',
  validateBoardInput,
  async (
    request: Request<{}, TBoard, TCreateBoardRequest>,
    response: Response<TBoard>,
  ) => {
    const board: TBoard = {
      id: randomUUID(),
      name: request.body.name,
    };

    await createBoard(board);

    response.send(board);
  },
);

boardsRouter.put(
  '/:id',
  validateBoardInput,
  async (
    request: Request<TIdParams, TBoard, TCreateBoardRequest>,
    response: Response<TBoard>,
  ) => {
    const board = {
      id: request.params.id,
      name: request.body.name,
    };

    await updateBoard(board);

    response.send(board);
  },
);

boardsRouter.delete(
  '/:id',
  async (request: Request<TIdParams>, response: Response<void>) => {
    await deleteBoard(request.params.id);
    response.sendStatus(204);
  },
);
