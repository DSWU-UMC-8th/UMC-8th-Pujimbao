import { useMutation } from "@tanstack/react-query";
import { updateMyInfo } from "../../apis/auth";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function useUpdateMyInfo() {
  return useMutation({
    mutationFn: updateMyInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
      alert("수정 완료!");
    },
  });
}

export default useUpdateMyInfo;
