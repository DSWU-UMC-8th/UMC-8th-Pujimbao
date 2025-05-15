import { useMutation } from "@tanstack/react-query";
import { postSignin } from "../../apis/auth";
import { RequestSigninDto, ResponseSigninDto } from "../../types/auth";

const useLogin = () => {
  return useMutation<ResponseSigninDto["data"], Error, RequestSigninDto>({
    mutationFn: postSignin, // ✅ 반드시 객체 속성으로 전달
    onSuccess: (data) => {
      const { accessToken, refreshToken, name } = data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userName", name);
      localStorage.setItem("userId", String(data.id));

      alert("로그인 성공");
      window.location.href = "/";
    },
    onError: (error) => {
      alert("로그인 실패: " + error.message);
    },
  });
};

export default useLogin;
