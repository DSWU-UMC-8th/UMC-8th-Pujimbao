import { useMutation } from "@tanstack/react-query";
import { patchLp } from "../../apis/lp";

const useUpdateLp = () => {
  return useMutation({
    mutationFn: patchLp,
    onSuccess: () => {
      alert("수정이 완료되었습니다.");
    },
    onError: () => {
      alert("수정에 실패했습니다.");
    },
  });
};

export default useUpdateLp;
