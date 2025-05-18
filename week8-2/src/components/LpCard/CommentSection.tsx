import { useInView } from "react-intersection-observer";
import { PAGINATION_ORDER } from "../../enums/common";
import { useState, useEffect } from "react";
import useInfiniteComments from "../../hooks/queries/useInfiniteComments";
import usePostComment from "../../hooks/mutation/usePostComment";
import useDeleteComment from "../../hooks/mutation/useDeleteComment";
import useEditComment from "../../hooks/mutation/useEditComment";

interface CommentSectionProps {
  lpId: number;
}

const CommentSection = ({ lpId }: CommentSectionProps) => {
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const { ref, inView } = useInView();

  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");

  // ✅ userId 안전하게 꺼냄
  const userId = Number(localStorage.getItem("userId") || -1);

  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteComments(lpId, order);

  const { mutate: postComment } = usePostComment(lpId);
  const { mutate: deleteComment } = useDeleteComment(lpId);
  const { mutate: editComment } = useEditComment(lpId);

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  const handleSubmit = () => {
    if (!newContent.trim()) return;
    postComment({ lpId, content: newContent });
    setNewContent("");
  };

  return (
    <div className="mt-10">
      {/* 정렬 버튼 */}
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={() => setOrder(PAGINATION_ORDER.asc)}
          className={`px-3 py-1 border rounded ${order === PAGINATION_ORDER.asc ? "bg-gray-200" : ""}`}
        >
          오래된순
        </button>
        <button
          onClick={() => setOrder(PAGINATION_ORDER.desc)}
          className={`px-3 py-1 border rounded ${order === PAGINATION_ORDER.desc ? "bg-gray-200" : ""}`}
        >
          최신순
        </button>
      </div>

      {/* 댓글 작성 UI */}
      <div className="mt-10">
        <textarea
          placeholder="댓글을 입력하세요..."
          className="w-full border rounded p-3 resize-none"
          rows={4}
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <button
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleSubmit}
        >
          작성
        </button>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments?.pages
          .flatMap((page) => page.data.data)
          .map((comment) => (
            <div key={comment.id} className="p-4 border rounded shadow-sm bg-white relative mt-10">
              {/* 작성자 이름 */}
              <p className="text-sm text-gray-600">{comment.author.name}</p>

              {editingId === comment.id ? (
                <>
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                  />
                  <div className="mt-1 space-x-2">
                    <button
                      onClick={() => {
                        editComment({ lpId, commentId: comment.id, content: editingContent });
                        setEditingId(null);
                      }}
                      className="text-sm text-blue-600"
                    >
                      저장
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-sm text-gray-500">
                      취소
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-base">{comment.content}</p>
              )}

              <p className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleString()}
              </p>

              {/* 본인 댓글일 경우만 메뉴 표시 */}
              {comment.author?.id === userId && editingId !== comment.id && (
                <div className="absolute top-2 right-2">
                  <details className="relative">
                    <summary className="cursor-pointer text-sm list-none">⋯</summary>
                    <div className="absolute right-0 mt-1 bg-white border rounded shadow-md z-10 flex gap-2 px-2 py-1">
                      <button
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditingContent(comment.content);
                        }}
                        className="inline-flex w-auto text-sm text-blue-500 hover:underline"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => deleteComment({ lpId, commentId: comment.id })}
                        className="inline-flex w-auto text-sm text-red-500 hover:underline"
                      >
                        삭제
                      </button>
                    </div>
                  </details>
                </div>
              )}
            </div>
          ))}
      </div>

      {isFetching && <p className="text-center text-sm mt-4">불러오는 중...</p>}
      <div ref={ref} className="h-4" />
    </div>
  );
};

export default CommentSection;
