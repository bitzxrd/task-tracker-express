import { TCard } from '../types/cards';
import { TCardIdParams, TColumnIdParams } from '../types/common';
import { sqliteAll, sqliteGet, sqliteRun } from './db-connection';

export const createCard = async (card: TCard): Promise<void> => {
  await sqliteRun(
    `
    INSERT INTO cards (id, text, column_id)
    VALUES (?, ?, ?);
  `,
    [card.id, card.text, card.columnId],
  );
};

export const updateCard = async (card: TCard): Promise<void> => {
  await sqliteRun(
    `
    UPDATE cards SET text = ?, column_id = ?
    WHERE id = ?;
  `,
    [card.text, card.columnId, card.id],
  );
};

export const deleteCard = async (
  cardId: string,
  columnId: string,
): Promise<void> => {
  await sqliteRun(
    `
    DELETE FROM cards
    WHERE id = ? AND column_id = ?;
  `,
    [cardId, columnId],
  );
};

const isCard = (data: unknown): data is TCard => {
  const card = data as TCard;
  return Boolean(
    data &&
    typeof card === 'object' &&
    'id' in card &&
    'text' in card &&
    'columnId' in card,
  );
};

export const getOneCard = async ({
  cardId,
  columnId,
  boardId,
}: TCardIdParams): Promise<TCard | null> => {
  const data = await sqliteGet(
    `
    SELECT cards.id, cards.text, cards.column_id AS "columnId"
    FROM cards LEFT JOIN columns
    ON cards.column_id = columns.id
    WHERE cards.id = ? AND columns.id = ? AND columns.board_id = ?; 
    `,
    [cardId, columnId, boardId],
  );

  if (isCard(data)) {
    return data;
  }

  return null;
};

export const getManyCards = async ({columnId, boardId}: TColumnIdParams): Promise<TCard[]> => {
  const data = await sqliteAll(
    `
    SELECT cards.id, cards.text, cards.column_id AS "columnId"
    FROM cards LEFT JOIN columns
    ON cards.column_id = columns.id
    WHERE columns.id = ? AND columns.board_id = ?; 
    `,
    [columnId, boardId],
  );

  if (!Array.isArray(data)) {
    console.error('Unknown data format on getMany', data);
    throw new Error('Unknown data format on getMany');
  }

  return data
    .map((one) => {
      if (isCard(one)) {
        return one;
      }

      return undefined;
    })
    .filter((one) => one !== undefined);
};
