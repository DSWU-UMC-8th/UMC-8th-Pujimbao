// import { useMutation } from "@tanstack/react-query";
// import { updateMyInfo } from "../../apis/auth";
// import { queryClient } from "../../App";
// import { QUERY_KEY } from "../../constants/key";

// function useUpdateMyInfo() {
//   return useMutation({
//     mutationFn: updateMyInfo,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
//       alert("수정 완료!");
//     },
//   });
// }

// export default useUpdateMyInfo;

import { useMutation } from "@tanstack/react-query";
import { updateMyInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";
import { queryClient } from "../../App";
import { ResponseMyInfoDto } from "../../types/auth";

function useUpdateMyInfo() {
  return useMutation({
    mutationFn: updateMyInfo,

    onMutate: async (newInfo) => {
      // 1. 기존 내 정보 쿼리 취소
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });

      // 2. 기존 데이터 가져오기
      const previousData = queryClient.getQueryData<ResponseMyInfoDto>([
        QUERY_KEY.myInfo,
      ]);

      // 3. Optimistic Update 적용
      if (previousData) {
        const optimisticData: ResponseMyInfoDto = {
          ...previousData,
          data: {
            ...previousData.data,
            name: newInfo.name,
            bio: newInfo.bio,
            avatar: newInfo.avatar,
          },
        };

        queryClient.setQueryData([QUERY_KEY.myInfo], optimisticData);
      }

      return { previousData };
    },

    // 4. 실패 시 rollback
    onError: (err, newInfo, context) => {
      if (context?.previousData) {
        queryClient.setQueryData([QUERY_KEY.myInfo], context.previousData);
      }
    },

    // 5. 성공 후에도 서버 데이터 재요청하여 최신 상태 보장
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
  });
}

export default useUpdateMyInfo;
