import { CommonResponse } from "./common";

export type CommentDto = {
  id: number;
  lpId: number;
  authorId: number; 
  author: {         
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
};


export type ResponseCommentListDto = CommonResponse<{
  data: CommentDto[];
  nextCursor: number;
  hasNext: boolean;
}>;
