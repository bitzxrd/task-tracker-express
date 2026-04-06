import express, { Request, Response } from 'express';
import { TGetBoardsResponse, TBoard, TCreateBoardRequest, TGetBoardResponse } from '../types/boards';
import { TBoardIdParams } from '../types/common';
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
  '/:boardId',
  async (
    request: Request<TBoardIdParams, TGetBoardResponse | string, {}>,
    response: Response<TGetBoardResponse | string>,
  ) => {
    const board = await getOneBoard(request.params.boardId);

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
  '/:boardId',
  validateBoardInput,
  async (
    request: Request<TBoardIdParams, TBoard, TCreateBoardRequest>,
    response: Response<TBoard>,
  ) => {
    const board = {
      id: request.params.boardId,
      name: request.body.name,
    };

    await updateBoard(board);

    response.send(board);
  },
);

boardsRouter.delete(
  '/:boardId',
  async (request: Request<TBoardIdParams>, response: Response<void>) => {
    await deleteBoard(request.params.boardId);
    response.sendStatus(204);
  },
);
