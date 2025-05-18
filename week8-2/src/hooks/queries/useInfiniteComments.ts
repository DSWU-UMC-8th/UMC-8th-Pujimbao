import { useInfiniteQuery } from "@tanstack/react-query";
import { getCommentsByLpId } from "../../apis/comment";
import { QUERY_KEY } from "../../constants/key";
import { PAGINATION_ORDER } from "../../enums/common";

const useInfiniteComments = (
  lpId: string | number,
  order: PAGINATION_ORDER,
  limit = 10
) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.comments, lpId, order],
    queryFn: ({ pageParam = 0 }) =>
      getCommentsByLpId({ lpId, cursor: pageParam, limit, order }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
  });
};

export default useInfiniteComments;
