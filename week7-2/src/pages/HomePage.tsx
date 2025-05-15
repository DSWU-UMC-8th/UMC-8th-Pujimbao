import { useEffect, useState } from "react";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import {useInView} from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import AddLpModal from "../components/AddLpModal";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  // const {data, isPending, isError} = useGetLpList({search});
  const {data:lps, isFetching, hasNextPage, isPending, fetchNextPage, isError} = useGetInfiniteLpList({
    limit: 50,
    search,
    order: PAGINATION_ORDER.desc,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ref: 특정한 HTML 요소를 감시할 수 있다.
  // InView: 그 요소가 화면에 보이면 true
  const {ref, inView} = useInView({
    threshold: 0 // 진입절 조절
  })

  useEffect(()=> {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  // if (isPending) { //Loading UI
  //   return <div className={"mt-20"}>Loading...</div>
  // }

  if (isError) { // Error UI
    return <div className={"mt-20"}>Error</div>
  }

    const handleLpClick = (lpId: number) => {
    if (!accessToken) {
      const confirmLogin = window.confirm("로그인이 필요한 서비스입니다. 로그인하시겠습니까?");
      if (confirmLogin) {
        navigate("/login");
      }
    } else {
      navigate(`/lp/${lpId}`);
    }
  };

  return (
    <div className="ml-0 mt-4 px-3 py-3">
      {/* 오래된순/최신순 버튼 */}
      <div className="flex justify-end mb-4 space-x-2">
        <button className="text-sm px-3 py-1 border rounded hover:bg-gray-100">
          오래된순
        </button>
        <button className="text-sm px-3 py-1 border rounded hover:bg-gray-100">
          최신순
        </button>
      </div>

      {/* LP 목록 */}
      <input value={search} onChange={(e)=>setSearch(e.target.value)}/>
      <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"}>
        {/* {lps?.pages?.map((page)=>console.log(page.data.data))} */}
        {/* <div ref={ref} className={"mt-8 flex justify-center bg-gray-400 h-2"}></div> */}
        {lps?.pages
          ?.map((page) => page.data.data)
          ?.flat()
          ?.map((lp) => (
            <div key={lp.id} onClick={()=>handleLpClick(lp.id)} className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              {/* <LpCard key={lp.id} lp={lp} /> */}
              <img
                src={lp.thumbnail}  //{lp.thumbnail}수정
                alt={lp.title}
                className="object-cover w-full h-40">
              </img>
              {/* Hover 시 나타나는 오버레이 */}
              <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 hover:opacity-80 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-4">
                <h3 className="text-lg font-bold mb-1">{lp.title}</h3>
                <p className="text-sm mb-1"> {new Date(lp.createdAt).toLocaleDateString("ko-KR")}</p>
                <p className="text-sm">❤️ {0} 좋아요</p>
              </div>
            </div>
          ))
        }
        {isFetching && <LpCardSkeletonList count={20} />}
      </div>    
        {/* <div ref={ref}>
          {!isFetching && (
            <div>Loading...</div>
          )}
        </div> */}
        <div ref={ref} className="h-2"></div>

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
  )
};

export default HomePage;

