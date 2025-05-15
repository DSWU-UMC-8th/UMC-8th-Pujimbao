
import { useInView } from "react-intersection-observer";
import { PAGINATION_ORDER } from "../../enums/common";
import { useState, useEffect } from "react";
import useInfiniteComments from "../../hooks/queries/useInfiniteComments";

interface CommentSectionProps {
  lpId: number;
}

const CommentSection = ({ lpId }: CommentSectionProps) => {
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const { ref, inView } = useInView();

  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteComments(lpId, order);

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  return (
    <div className="mt-10">
      {/* 정렬 버튼 */}
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={() => setOrder(PAGINATION_ORDER.asc)}
          className={`px-3 py-1 border rounded ${
            order === PAGINATION_ORDER.asc ? "bg-gray-200" : ""
          }`}
        >
          오래된순
        </button>
        <button
          onClick={() => setOrder(PAGINATION_ORDER.desc)}
          className={`px-3 py-1 border rounded ${
            order === PAGINATION_ORDER.desc ? "bg-gray-200" : ""
          }`}
        >
          최신순
        </button>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments?.pages
          .flatMap((page) => page.data.data)
          .map((comment) => (
            <div
              key={comment.id}
              className="p-4 border rounded shadow-sm bg-white"
            >
              <p className="text-sm text-gray-600">{comment.userName}</p>
              <p className="text-base">{comment.content}</p>
              <p className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
      </div>

      {isFetching && <p className="text-center text-sm mt-4">불러오는 중...</p>}
      <div ref={ref} className="h-4" />

      {/* 댓글 작성 UI (디자인만) */}
      <div className="mt-10">
        <textarea
          placeholder="댓글을 입력하세요..."
          className="w-full border rounded p-3 resize-none"
          rows={4}
          disabled
        />
        <button
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled
        >
          작성
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
