export type TGetBoardResponseCard = {
  id: string;
  text: string;
}


export type TGetBoardResponseColumn = {
  id: string;
  name: string;
  cards: TGetBoardResponseCard[];
}


export type TGetBoardResponse = {
  id: string;
  name: string;
  columns: TGetBoardResponseColumn[];
}