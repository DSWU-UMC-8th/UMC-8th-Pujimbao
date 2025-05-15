import { useParams } from "react-router-dom";
import useGetLpById from "../hooks/queries/useGetLpById";
import CommentSection from "../components/LpCard/CommentSection";

const LpDetailPage = () => {
  const { lpId } = useParams();
  const { data: lp, isLoading, isError } = useGetLpById(lpId);

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
      <p className="text-lg mb-6">{lp.description}</p>

      <div className="flex gap-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          ✏️ 수정
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          🗑 삭제
        </button>
        <button className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">
          ❤️ 좋아요 {lp.likes}
        </button>
      </div>

      <CommentSection lpId={lp.id} />
    </div>
  );
};

export default LpDetailPage;
