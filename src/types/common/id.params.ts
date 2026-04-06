export type TBoardIdParams = {
  boardId: string;
};

export type TColumnIdParams = TBoardIdParams & {
  columnId: string;
};

export type TCardIdParams = TColumnIdParams & {
  cardId: string;
};