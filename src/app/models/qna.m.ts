export interface IComment {
  reg_date: string;
  content: string;
}

export interface IQnA {
  writer: string;
  reg_date: string;
  title: string;
  content: string;
  comment: IComment;
}
