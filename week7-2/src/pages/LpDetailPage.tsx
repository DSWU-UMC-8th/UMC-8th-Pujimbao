import { useParams } from "react-router-dom";
import useGetLpById from "../hooks/queries/useGetLpById";
import CommentSection from "../components/LpCard/CommentSection";
import usePostLike from "../hooks/mutation/usePostLike";
import useDeleteLike from "../hooks/mutation/useDeleteLike";

const LpDetailPage = () => {
  const { lpId: lpIdParam } = useParams();
  // 타입이 달라 좋아요 수가 바로 반영되지 않는 문제 해결
  const lpId = Number(lpIdParam);
  const { data: lp, isLoading, isError } = useGetLpById(lpId);

  const userId = Number(localStorage.getItem("userId"));

  // 좋아요 눌렀는지 확인
  const isLiked = lp?.likes?.some((like) => like.userId === userId);

  // mutation 훅 사용
  const { mutate: likeMutate } = usePostLike();
  const { mutate: disLikeMutate } = useDeleteLike();

  const handleLikeLp = () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    likeMutate({ lpId: Number(lpId) });
  };

  const handleDislikeLp = () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    disLikeMutate({ lpId: Number(lpId) });
  };

  if (isLoading) return <div className="mt-20">불러오는 중...</div>;
  if (isError || !lp) return <div className="mt-20">LP 정보를 불러올 수 없습니다.</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />
      <h1 className="text-3xl font-bold mb-2">{lp.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        업로드 날짜: {new Date(lp.createdAt).toLocaleDateString("ko-KR")}
      </p>
      <p className="text-lg mb-6">{lp.content}</p>

      <div className="flex gap-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          ✏️ 수정
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          🗑 삭제
        </button>
        <button
          onClick={isLiked ? handleDislikeLp : handleLikeLp}
          className={`px-4 py-2 rounded text-white ${
            isLiked ? "bg-gray-500 hover:bg-gray-600" : "bg-pink-500 hover:bg-pink-600"
          }`}
        >
          {isLiked ? "💔 좋아요 취소" : "❤️ 좋아요"} {lp.likes.length}
        </button>
      </div>

      <CommentSection lpId={lp.id} />
    </div>
  );
};

export default LpDetailPage;
