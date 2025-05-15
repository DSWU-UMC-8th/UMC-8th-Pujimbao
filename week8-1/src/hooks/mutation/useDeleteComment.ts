import { useMutation } from "@tanstack/react-query";
import { deleteComment } from "../../apis/comment";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function useDeleteComment(lpId: number) {
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.comments, lpId] });
    }
  });
}
export default useDeleteComment;
