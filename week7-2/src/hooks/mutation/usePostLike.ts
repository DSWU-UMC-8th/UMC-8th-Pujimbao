// import {useMutation} from "@tanstack/react-query";
// import { postLike } from "../../apis/lp";
// import { queryClient } from "../../App";
// import { QUERY_KEY } from "../../constants/key";
// import { Likes, ResponseLpDto } from "../../types/lp";
// import { ResponseMyInfoDto } from "../../types/auth";

// function usePostLike() {
//   return useMutation({
//     mutationFn: postLike,
//     // onMutate -> API 요청 이전에 호출되는 친구
//     // UI에 바로 변경을 보여주기 위해 Cache 업데이트
//     onMutate: async(lp) => {
//       // 1. 이 게시글에 관련된 쿼리를 취소 (캐시된 데이터를 새로 불러오는 요청)
//       await queryClient.cancelQueries({
//         queryKey: [QUERY_KEY.lps, lp.lpId],
//       });

//       // 2. 현재 게시글의 데이터를 캐시에서 가져와야 함
//       const previousLpPost = queryClient.getQueryData<ResponseLpDto>([
//         QUERY_KEY.lps,
//         lp.lpId,
//       ]);

//       // 게시글 데이터를 복사해서 NewLpPost라는 새로운 객체 생성
//       // -> 복사하는 이유: 나중에 오류가 발생했을 때 이전 상태로 되돌리기 위해서
//       const newLpPost = {...previousLpPost};

//       // 게시글에 저장된 좋아요 목록에서 현재 내가 눌렀던 좋아요의 위치를 찾아야함
//       const me = queryClient.getQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo]);
//       const userId = Number(me?.data.id);
//       const likedIndex = previousLpPost?.data.likes.findIndex(
//         (like) => like.userId === userId,
//       ) ?? -1;

//       if (likedIndex >= 0) {
//         previousLpPost?.data.likes.splice(likedIndex, 1); // 내가 있는 위치를 찾아서 배열 하나(좋아요) 제거거
//       } else {
//         const newLike = {userId, lpId: lp.lpId} as Likes;
//         previousLpPost?.data.likes.push(newLike);
//       }

//       // 업데이트된 게시글 데이터를 캐시에 저장
//       // 이렇게 하면 UI가 바로 업데이트 됨. 사용자가 변화를 확인할 수 있다.
//       queryClient.setQueryData([QUERY_KEY.lps, lp.lpId], newLpPost);

//       return {previousLpPost, newLpPost};
//     },

//     onError: (err, newLp, context) => {
//       console.log(err, newLp);
//       queryClient.setQueryData(
//         [QUERY_KEY.lps, newLp.lpId],
//         context?.previousLpPost?.data.id,
//       );
//     },

//     // onSettled는 API 요청이 끝난 후 (성공하든 실패하든 실행)
//     onSettled: async(data, error, variables, context) => {
//       await queryClient.invalidateQueries({
//         queryKey: [QUERY_KEY.lps, variables.lpId],
//       })
//     }
//   })
// }

// export default usePostLike;

import {useMutation} from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function usePostLike() {
  return useMutation({
    mutationFn: postLike,
    // data: API 성공 응답데이터
    // variables: mutate에 전달한 값
    // context: onMutate에서 반환한 값
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lp, data.data.lpId],
        exact: true,
      })
    },
    // error: 요청 실패시 발생한 에러
    // variables: mutate에 전달한 값
    // context: onMutate에서 반환한 값
    onError: (error, variables, context) => {},
    onMutate: (variables) => {
      console.log("hi");
    },
    // 요청이 끝난 후 항상 실행됨 (=OnSuccess, onError 후에 실행됨)
    // 로딩 상태를 초기화할 때 조금 유용하다.
    onSettled: (data, error, variables, context) => {}
  })
}

export default usePostLike;