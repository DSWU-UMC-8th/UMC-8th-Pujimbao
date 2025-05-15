import { useMutation } from "@tanstack/react-query";
import { deleteLp } from "../../apis/lp";
import { useNavigate } from "react-router-dom";

const useDeleteLp = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (lpId: number) => deleteLp(lpId),
    onSuccess: () => {
      alert("삭제가 완료되었습니다.");
      navigate("/"); // 홈 페이지로 이동 
    },
    onError: () => {
      alert("삭제에 실패했습니다.");
    },
  });
};

export default useDeleteLp;
