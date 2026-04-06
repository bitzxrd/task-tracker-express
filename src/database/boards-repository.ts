import { TBoard, TGetBoardResponse, TGetBoardResponseCard, TGetBoardResponseColumn } from '../types/boards';
import { sqliteAll, sqliteGet, sqliteRun } from './db-connection';

type TOneBoardDatabaseResult = {
  boardId: string;
  boardName: string;
  columnId: string | null;
  columnName: string | null;
  cardId: string | null;
  cardText: string | null;
};

export const createBoard = async (board: TBoard): Promise<void> => {
  await sqliteRun(
    `
    INSERT INTO boards (id, name)
    VALUES (?, ?);
  `,
    [board.id, board.name],
  );
};

export const updateBoard = async (board: TBoard): Promise<void> => {
  await sqliteRun(
    `
    UPDATE boards SET name = ?
    WHERE id = ?;
  `,
    [board.name, board.id],
  );
};

export const deleteBoard = async (id: string): Promise<void> => {
  await sqliteRun(
    `
    DELETE FROM boards
    WHERE id = ?;
  `,
    [id],
  );
};

const isBoard = (data: unknown): data is TBoard => {
  const board = data as TBoard;
  return Boolean(
    data && typeof board === 'object' && 'id' in board && 'name' in board,
  );
};

export const getOneBoard = async (
  id: string,
): Promise<TGetBoardResponse | null> => {
  const data = await sqliteAll(
    `
    SELECT 
      boards.id AS "boardId",
      boards.name AS "boardName",
      columns.id AS "columnId",
      columns.name AS "columnName",
      cards.id AS "cardId",
      cards.text AS "cardText"
    FROM boards 
    LEFT JOIN columns ON boards.id = columns.board_id
    LEFT JOIN cards ON columns.id = cards.column_id
    WHERE boards.id = ?
    ORDER BY columns.name ASC NULLS LAST, columns.id ASC, cards.text ASC NULLS LAST
  `,
    [id],
  );

  if (!isBoardDataBaseResult(data) || !data.length) {
    return null;
  }

  return mapOneBoardResult(data);
};

const mapOneBoardResult = (data: TOneBoardDatabaseResult[]): TGetBoardResponse => {

  const columns: TGetBoardResponseColumn[] = [];
  let column: TGetBoardResponseColumn | undefined;

  for (const row of data) {
    if (!row.columnId) break;
    if (!column) {
      column = {
        id: row.columnId!,
        name: row.columnName!,
        cards: [],
      }
    }

    if (column.id !== row.columnId) {
      columns.push(column);
      column = {
        id: row.columnId!,
        name: row.columnName!,
        cards: [],
      }
    }

    if (!row.cardId) continue;

    column.cards.push({
      id: row.cardId!,
      text: row.cardText!,
    });
  }

  if (column) {
    columns.push(column);
  }

  return {
    id: data[0].boardId,
    name: data[0].boardName,
    columns: column ? [...columns, column] : columns,
  }
}

export const getManyBoards = async (): Promise<TBoard[]> => {
  const data = await sqliteAll(`SELECT * FROM boards`);

  if (!Array.isArray(data)) {
    console.error('Unknown data format on getMany', data);
    throw new Error('Unknown data format on getMany');
  }

  return data
    .map((one) => {
      if (isBoard(one)) {
        return one;
      }

      return undefined;
    })
    .filter((one) => one !== undefined);
};


const isBoardDataBaseResult = (data: unknown): data is TOneBoardDatabaseResult[] => {
  if (!Array.isArray(data)) {
    console.error('Unknown data format on getBoard', data);
    throw new Error('Unknown data format on getBoard');
  }

  const board = data as TOneBoardDatabaseResult[];

  for (const row of board) {
    if (!row || !row.boardId || !row.boardName) {
      return false
    }
  }

  return true;
};