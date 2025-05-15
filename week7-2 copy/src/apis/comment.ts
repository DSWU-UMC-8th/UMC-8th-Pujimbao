import { axiosInstance } from "./axios";
import { PAGINATION_ORDER } from "../enums/common";
import { ResponseCommentListDto } from "../types/comment";

export const getCommentsByLpId = async ({
  lpId,
  cursor,
  limit,
  order,
}: {
  lpId: number | string;
  cursor: number;
  limit: number;
  order: PAGINATION_ORDER;
}): Promise<ResponseCommentListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { cursor, limit, order },
  });

  return data;
};

// ✅ 댓글 생성
export const postComment = async ({
  lpId,
  content,
}: {
  lpId: number;
  content: string;
}) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
    content,
  });
  return data;
};

// ✅ 댓글 수정
export const editComment = async ({
  lpId,
  commentId,
  content,
}: {
  lpId: number;
  commentId: number;
  content: string;
}) => {
  const { data } = await axiosInstance.patch(
    `/v1/lps/${lpId}/comments/${commentId}`,
    { content }
  );
  return data;
};

// ✅ 댓글 삭제
export const deleteComment = async ({
  lpId,
  commentId,
}: {
  lpId: number;
  commentId: number;
}) => {
  const { data } = await axiosInstance.delete(
    `/v1/lps/${lpId}/comments/${commentId}`
  );
  return data;
};
