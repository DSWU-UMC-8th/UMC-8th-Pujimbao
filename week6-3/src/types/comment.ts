import { CommonResponse } from "./common";

export type CommentDto = {
  id: number;
  lpId: number;
  userId: number;
  userName: string;
  content: string;
  createdAt: string; // ISO 날짜 문자열
  updatedAt: string;
};

export type ResponseCommentListDto = CommonResponse<{
  data: CommentDto[];
  nextCursor: number;
  hasNext: boolean;
}>;
