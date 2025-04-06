import { useEffect, useState } from "react";
import axios from "axios";
import {Movie, MovieResponse} from '../types/movie'
import MovieCard from "../components/movieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  //로딩 상태
  const [isPending, setIsPending] = useState(false);
  //에러 상태
  const [isError, setIsError] = useState(false);
  // 페이지 상태
  const [page, setPage] = useState(1);

  const {category} = useParams<{
    category: string;
  }>();
  console.log(category);

  useEffect((): void => {
    const apiKey = import.meta.env.VITE_TMDB_KEY;
    const fetchMovies = async(): Promise<void> => {
      setIsPending(true); //fetchMovies를 시작할 때는 로딩 상태가 데이터를 호출하는 중중

      // 이 부분은 데이터를 성공적으로 가져왔을 때 보여주는 페이지이므로, try문으로 묶기
      try {
        const {data} = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${category}?api_key=${apiKey}&language=en-US&page=${page}`
        );
        //fetch를 사용할 때는 실질적인 데이터 값을 json으로 한번 풀어주는 과정 필요
        //const result = await response.json();

        setMovies(data.results);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    }
    fetchMovies();
  }, [page, category]); //페이지가 바뀔때마다 위의 코드들을 재실행시켜야하므로 page 넘겨줘야함

  if (isError) {
    return <div>
      <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
    </div>
  }

  return (
    <>
      <div className="flex items-center justify-center gap-6 mt-5">
        <button 
          className='bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
          hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300
          cursor-pointer disabled:cursor-not-allowed'
          disabled={page === 1} 
          onClick={(): void => setPage((prev): number => prev-1)}>
          {'<'}
        </button>
        <span>{page} 페이지</span>
        <button
          className='bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
          hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer'
          onClick={(): void => setPage((prev): number => prev+1)}>
          {'>'}
        </button>
      </div>

      {/*페이지 넘길때 로딩스피너 처리*/}
      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner/>
        </div>
      )}
      {!isPending && (
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie}></MovieCard>
        ))}
        </div>
      )}
    </>
  )
}