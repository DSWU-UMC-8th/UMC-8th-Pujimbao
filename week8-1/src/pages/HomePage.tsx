import { useEffect, useState } from "react";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import AddLpModal from "../components/AddLpModal";
import useDebounce from "../hooks/useDebounce";
import { SEARCH_DEBOUNCE_DELAY } from "../constants/delay";
import useSearchLpList from "../hooks/queries/useSearchLpList";
import { useSearchContext } from "../context/SearchContext"; // ✅ 추가

const HomePage = () => {
  const { search } = useSearchContext(); // ✅ 검색어 가져오기
  const debouncedValue = useDebounce(search, SEARCH_DEBOUNCE_DELAY);
  const [searchMode, setSearchMode] = useState(false);

  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    fetchNextPage,
    isError,
  } = useGetInfiniteLpList({
    limit: 50,
    debouncedValue,
    order: PAGINATION_ORDER.desc,
  });

  const {
    data: searchResult,
    isFetching: isSearching,
  } = useSearchLpList(debouncedValue, searchMode && debouncedValue.length > 0);
  
console.log("🔍 searchResult 응답 구조 확인:", searchResult); // 확인 후 삭제

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    setSearchMode(debouncedValue.trim().length > 0);
  }, [debouncedValue]);

  useEffect(() => {
    if (inView && !searchMode) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage, searchMode]);

  if (isError) {
    return <div className="mt-20">Error</div>;
  }

  const handleLpClick = (lpId: number) => {
    if (!accessToken) {
      const confirmLogin = window.confirm(
        "로그인이 필요한 서비스입니다. 로그인하시겠습니까?"
      );
      if (confirmLogin) navigate("/login");
    } else {
      navigate(`/lp/${lpId}`);
    }
  };

// LP 목록 표시 부분
  const displayedLps = searchMode
    ? searchResult?.data?.data || []
    : lps?.pages?.map((page) => page.data.data).flat() || [];

  return (
    <div className="ml-0 mt-4 px-3 py-3">
      {/* LP 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedLps.map((lp) => (
          <div
            key={lp.id}
            onClick={() => handleLpClick(lp.id)}
            className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="object-cover w-full h-40"
            />
            <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 hover:opacity-80 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-4">
              <h3 className="text-lg font-bold mb-1">{lp.title}</h3>
              <p className="text-sm mb-1">
                {new Date(lp.createdAt).toLocaleDateString("ko-KR")}
              </p>
              <p className="text-sm">❤️ {0} 좋아요</p>
            </div>
          </div>
        ))}
        {(isFetching && !searchMode) || (isSearching && searchMode) ? (
          <LpCardSkeletonList count={20} />
        ) : null}
      </div>

      {/* 무한스크롤 ref */}
      {!searchMode && <div ref={ref} className="h-2" />}

      {/* LP 등록 버튼 */}
      <div className="fixed bottom-5 left-5">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-pink-500 text-white rounded-full w-12 h-12 text-2xl"
        >
          +
        </button>
      </div>
      {isModalOpen && <AddLpModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default HomePage;
