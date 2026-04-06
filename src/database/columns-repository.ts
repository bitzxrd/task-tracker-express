import { TColumn } from '../types/columns';
import { sqliteAll, sqliteGet, sqliteRun } from './db-connection';

export const createColumn = async (column: TColumn): Promise<void> => {
  await sqliteRun(
    `
    INSERT INTO columns (id, name, board_id)
    VALUES (?, ?, ?);
  `,
    [column.id, column.name, column.boardId],
  );
};

export const updateColumn = async (column: TColumn): Promise<void> => {
  await sqliteRun(
    `
    UPDATE columns SET name = ?
    WHERE board_id = ? AND id = ?;
  `,
    [column.name, column.boardId, column.id],
  );
};

export const deleteColumn = async (
  id: string,
  boardId: string,
): Promise<void> => {
  await sqliteRun(
    `
    DELETE FROM columns
    WHERE id = ? AND board_id = ?;
  `,
    [id, boardId],
  );
};

const isColumn = (data: unknown): data is TColumn => {
  const column = data as TColumn;
  return Boolean(
    data &&
    typeof column === 'object' &&
    'id' in column &&
    'name' in column &&
    'boardId' in column,
  );
};

export const getOneColumn = async (
  id: string,
  boardId: string,
): Promise<TColumn | null> => {
  const data = await sqliteGet(
    `SELECT id, name, board_id AS "boardId" FROM columns 
    WHERE id = ? AND board_id = ?`,
    [id, boardId],
  );

  if (isColumn(data)) {
    return data;
  }

  return null;
};

export const getManyColumns = async (boardId: string): Promise<TColumn[]> => {
  const data = await sqliteAll(
    `SELECT id, name, board_id AS "boardId" FROM columns WHERE board_id = ?`,
    [boardId],
  );

  if (!Array.isArray(data)) {
    console.error('Unknown data format on getMany', data);
    throw new Error('Unknown data format on getMany');
  }

  return data
    .map((one) => {
      if (isColumn(one)) {
        return one;
      }

      return undefined;
    })
    .filter((one) => one !== undefined);
};
