import { useMutation } from "@tanstack/react-query";
import { postWithdraw } from "../../apis/auth";

const useWithdraw = () => {
  return useMutation({
    mutationFn: postWithdraw,
    onSuccess: () => {
      alert("탈퇴가 완료되었습니다.");
      localStorage.clear();
      window.location.href = "/";
    },
    onError: () => {
      alert("탈퇴 중 오류가 발생했습니다.");
    },
  });
};

export default useWithdraw;
