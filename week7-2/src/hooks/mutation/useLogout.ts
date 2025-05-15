import { useMutation } from "@tanstack/react-query";
import { postLogout } from "../../apis/auth";

const useLogout = () => {
  return useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      localStorage.clear();
      alert("로그아웃 되었습니다.");
      window.location.href = "/";
    },
    onError: () => {
      alert("로그아웃 중 오류 발생");
    },
  });
};

export default useLogout;
