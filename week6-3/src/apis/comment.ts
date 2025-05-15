import { axiosInstance } from "./axios";
import { PAGINATION_ORDER } from "../enums/common";
import { ResponseCommentListDto } from "../types/comment"; // 타입 미리 정의했다고 가정

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
