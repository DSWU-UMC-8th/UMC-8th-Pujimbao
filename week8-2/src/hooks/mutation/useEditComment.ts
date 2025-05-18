import { useMutation } from "@tanstack/react-query";
import { editComment } from "../../apis/comment";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function useEditComment(lpId: number) {
  return useMutation({
    mutationFn: editComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.comments, lpId] });
    }
  });
}
export default useEditComment;
