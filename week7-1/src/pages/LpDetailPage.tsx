import { useParams } from "react-router-dom";
import useGetLpById from "../hooks/queries/useGetLpById";
import CommentSection from "../components/LpCard/CommentSection";
import usePostLike from "../hooks/mutation/usePostLike";
import useDeleteLike from "../hooks/mutation/useDeleteLike";
import { useNavigate } from "react-router-dom";
import useDeleteLp from "../hooks/mutation/useDeleteLp";
import useUpdateLp from "../hooks/mutation/useUpdateLp";
import { useState } from "react";

const LpDetailPage = () => {
  const navigate = useNavigate();
  const { lpId: lpIdParam } = useParams();
  // 타입이 달라 좋아요 수가 바로 반영되지 않는 문제 해결
  const lpId = Number(lpIdParam);
  const { data: lp, isLoading, isError, refetch } = useGetLpById(lpId);

  const userId = Number(localStorage.getItem("userId"));
  const isAuthor = userId === lp?.authorId; // 본인 글인지 확인
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");


  // 좋아요 눌렀는지 확인
  const isLiked = lp?.likes?.some((like) => like.userId === userId);

  // mutation 훅 사용
  const { mutate: likeMutate } = usePostLike();
  const { mutate: disLikeMutate } = useDeleteLike();
  const { mutate: deleteLpMutate } = useDeleteLp();
  const { mutate: updateLpMutate } = useUpdateLp();

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

  const handleDelete = () => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (confirmDelete) {
      deleteLpMutate(lpId);
    }
  };

  const startEdit = () => {
    setEditMode(true);
    setEditTitle(lp.title);
    setEditContent(lp.content);
  };

  const handleUpdate = () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    updateLpMutate(
      { lpId, title: editTitle, content: editContent },
      {
        onSuccess: () => {
          refetch(); //새로고침해야 수정되는 문제 해결 
                      // -> 네트워크 요청 없이 즉시 화면 반영됨. 수정 완료 후 서버에서 최신 데이터를 다시 가져와서 화면에 반영
          setEditMode(false);
        }
      }

    );
    setEditMode(false);
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

    {/* 제목 */}
    {editMode ? (
      <input
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        className="w-full text-3xl font-bold mb-2 border p-2"
      />
    ) : (
      <h1 className="text-3xl font-bold mb-2">{lp.title}</h1>
    )}

    <p className="text-sm text-gray-500 mb-4">
      업로드 날짜: {new Date(lp.createdAt).toLocaleDateString("ko-KR")}
    </p>

    {/* 내용 */}
    {editMode ? (
      <textarea
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        className="w-full text-lg mb-6 border p-2"
        rows={8}
      />
    ) : (
      <p className="text-lg mb-6">{lp.content}</p>
    )}

    <div className="flex gap-4">
      {isAuthor && (
        <>
          {editMode ? (
            <>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleUpdate}
              >
                ✅ 수정 완료
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setEditMode(false)}
              >
                ❌ 취소
              </button>
            </>
          ) : (
            <>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => {
                  setEditMode(true);
                  setEditTitle(lp.title);
                  setEditContent(lp.content);
                }}
              >
                ✏️ 수정
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleDelete}
              >
                🗑 삭제
              </button>
            </>
          )}
        </>
      )}

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
